import Stripe from "stripe";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscriptionModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { userId, plan, period } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Determine Stripe price ID
    let priceId;
    if (plan === "premium" && period === "monthly") {
      priceId = process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID;
    } else if (plan === "premium" && period === "yearly") {
      priceId = process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID;
    } else {
      return res.status(400).json({ message: "Invalid plan or period" });
    }

    // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
        mode: "subscription", // or "payment"
        line_items: [
            {
            price: priceId,
            quantity: 1,
            },
        ],
        customer_email: user.email,

        success_url: `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/subscription/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
        });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Checkout session creation failed", error: error.message });
  }
};


// Create a new subscription
export const createSubscription = async (req, res) => {
  try {
    const { userId, plan, period, paymentMethodId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create Stripe customer if not exists
    let customerId = user.customerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      });
      customerId = customer.id;
      user.customerId = customerId;
      await user.save();
    }

    // Define product/price IDs from Stripe Dashboard
    const priceId =
      plan === "premium"
        ? period === "monthly"
          ? process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID
          : process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID
        : null;

    if (!priceId) return res.status(400).json({ message: "Invalid plan or period" });

    // Create subscription in Stripe
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    const startDate = new Date();
    const endDate =
      period === "monthly"
        ? new Date(startDate.setMonth(startDate.getMonth() + 1))
        : new Date(startDate.setFullYear(startDate.getFullYear() + 1));

    // Save subscription in DB
    const subscription = await Subscription.create({
      userId: user._id,
      plan,
      period,
      startDate: new Date(),
      endDate,
      stripeSubscriptionId: stripeSubscription.id, // Store Stripe subscription ID
    });

    user.plan = plan;
    user.subscription = subscription._id;
    await user.save();

    res.status(201).json({
      message: "Subscription created successfully",
      clientSecret: stripeSubscription.latest_invoice.payment_intent.client_secret,
      subscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Subscription creation failed", error: error.message });
  }
};

// Handle payment success callback
export const handlePaymentSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Find user by email
    const user = await User.findOne({ email: session.customer_email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    
    // Extract subscription details
    const plan = "premium"; // All paid subscriptions are premium
    const period = subscription.items.data[0].price.recurring.interval === "month" ? "monthly" : "yearly";
    
    // Handle undefined timestamps - use current time as fallback
    let startDate, endDate;
    
    if (subscription.current_period_start && subscription.current_period_end) {
      // Convert Unix timestamps to JavaScript Date objects
      startDate = new Date(subscription.current_period_start * 1000);
      endDate = new Date(subscription.current_period_end * 1000);
    } else {
      // Fallback: calculate dates based on period
      console.log(`⚠️ Missing period timestamps, calculating fallback dates`);
      startDate = new Date();
      endDate = new Date();
      
      if (period === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
    }

    // Check if subscription already exists for this user
    let existingSubscription = await Subscription.findOne({ userId: user._id });
    
    if (existingSubscription) {
      // Update existing subscription
      existingSubscription.plan = plan;
      existingSubscription.period = period;
      existingSubscription.startDate = startDate;
      existingSubscription.endDate = endDate;
      existingSubscription.stripeSubscriptionId = subscription.id; // Store Stripe subscription ID
      await existingSubscription.save();
      console.log(`✅ Updated subscription for ${user.email}`);
    } else {
      // Create new subscription
      const newSubscription = await Subscription.create({
        userId: user._id,
        plan,
        period,
        startDate,
        endDate,
        stripeSubscriptionId: subscription.id, // Store Stripe subscription ID
      });
      
      // Update user's subscription reference
      user.subscription = newSubscription._id;
      console.log(`✅ Created new subscription for ${user.email}`);
    }

    // Update user's plan
    user.plan = plan;
    await user.save();
    
    console.log(`✅ Updated ${user.email} to premium plan`);
    
    // Redirect to frontend success page
    res.redirect(`${process.env.CLIENT_URL}/payment-success`);
    
  } catch (error) {
    console.error("Error handling payment success:", error);
    res.status(500).json({ message: "Error processing payment success", error: error.message });
  }
};

// Get user's subscription details
export const getUserSubscription = async (req, res) => {
  try {
    const userId = req.user._id; // From protect middleware
    
    const subscription = await Subscription.findOne({ userId }).populate('userId', 'email firstName lastName');
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: "No subscription found",
        subscription: null 
      });
    }

    res.status(200).json({
      success: true,
      subscription: {
        id: subscription._id,
        plan: subscription.plan,
        period: subscription.period,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        isActive: subscription.endDate > new Date(),
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt
      }
    });
  } catch (error) {
    console.error("Error getting user subscription:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cancel user's subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id; // From protect middleware
    
    // Find the user to get their Stripe customer ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: "No subscription found to cancel" 
      });
    }

    // If subscription is already expired, just mark as canceled
    if (subscription.endDate <= new Date()) {
      await Subscription.findByIdAndDelete(subscription._id);
      
      // Update user's plan to free
      user.plan = "free";
      user.subscription = null;
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: "Subscription was already expired and has been removed"
      });
    }

    // Cancel subscription in Stripe if we have a Stripe subscription ID
    if (subscription.stripeSubscriptionId) {
      try {
        // Cancel the subscription in Stripe using the stored ID
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        console.log(`Canceled Stripe subscription: ${subscription.stripeSubscriptionId} for user: ${user.email}`);
      } catch (stripeError) {
        console.error("Error canceling Stripe subscription:", stripeError);
        console.error("Stripe Error Details:", JSON.stringify(stripeError, null, 2));
        // Continue with local cancellation even if Stripe cancellation fails
      }
    } else if (user.customerId) {
      // Fallback: If we don't have the subscription ID but have customer ID
      try {
        // List all active subscriptions for this customer
        const stripeSubscriptions = await stripe.subscriptions.list({
          customer: user.customerId,
          status: 'active'
        });
        
        // Cancel each active subscription in Stripe
        if (stripeSubscriptions.data.length > 0) {
          for (const sub of stripeSubscriptions.data) {
            await stripe.subscriptions.cancel(sub.id);
            console.log(`Canceled Stripe subscription: ${sub.id} for user: ${user.email}`);
            
            // Update the subscription with the Stripe ID for future reference
            if (!subscription.stripeSubscriptionId) {
              subscription.stripeSubscriptionId = sub.id;
            }
          }
        } else {
          console.log(`No active Stripe subscriptions found for user: ${user.email}`);
        }
      } catch (stripeError) {
        console.error("Error canceling Stripe subscription:", stripeError);
        console.error("Stripe Error Details:", JSON.stringify(stripeError, null, 2));
        // Continue with local cancellation even if Stripe cancellation fails
      }
    }
    
    // Mark subscription as canceled by setting end date to now
    subscription.endDate = new Date();
    await subscription.save();
    
    // Update user's plan to free
    user.plan = "free";
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Subscription canceled successfully"
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Handle Stripe webhooks
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    // Ensure we have the raw body for signature verification
    const rawBody = req.body;
    if (!rawBody || rawBody.length === 0) {
      console.error("⚠️ Empty webhook body received");
      return res.status(400).send("Empty webhook body");
    }

    console.log(`📦 Raw body length: ${rawBody.length} bytes`);

    event = stripe.webhooks.constructEvent(
      rawBody, // Raw buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`✅ Webhook received: ${event.type}`);

  // Handle event
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event.data.object);
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionEvent(event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};

// Handle checkout session completed
const handleCheckoutSessionCompleted = async (session) => {
  try {
    console.log(`🔍 Processing checkout session: ${session.id}`);
    
    const user = await User.findOne({ email: session.customer_email });
    if (!user) {
      console.log(`❌ User not found for email: ${session.customer_email}`);
      return;
    }

    // Only process if this is a subscription checkout
    if (!session.subscription) {
      console.log(`⚠️ No subscription found in session: ${session.id}`);
      return;
    }

    // Retrieve the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    console.log(`📅 Subscription period: ${subscription.current_period_start} to ${subscription.current_period_end}`);
    
    // Extract subscription details with proper date conversion
    const plan = "premium"; // All paid subscriptions are premium
    const period = subscription.items.data[0].price.recurring.interval === "month" ? "monthly" : "yearly";
    
    // Handle undefined timestamps - use current time as fallback
    let startDate, endDate;
    
    if (subscription.current_period_start && subscription.current_period_end) {
      // Convert Unix timestamps to JavaScript Date objects
      startDate = new Date(subscription.current_period_start * 1000);
      endDate = new Date(subscription.current_period_end * 1000);
    } else {
      // Fallback: calculate dates based on period
      console.log(`⚠️ Missing period timestamps, calculating fallback dates`);
      startDate = new Date();
      endDate = new Date();
      
      if (period === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
    }
    
    console.log(`📅 Converted dates - Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`);

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error(`❌ Invalid dates - Start: ${startDate}, End: ${endDate}`);
      console.error(`❌ Raw timestamps - Start: ${subscription.current_period_start}, End: ${subscription.current_period_end}`);
      return;
    }

    // Check if subscription already exists for this user
    let existingSubscription = await Subscription.findOne({ userId: user._id });
    
    if (existingSubscription) {
      // Update existing subscription
      existingSubscription.plan = plan;
      existingSubscription.period = period;
      existingSubscription.startDate = startDate;
      existingSubscription.endDate = endDate;
      existingSubscription.stripeSubscriptionId = subscription.id; // Store Stripe subscription ID
      await existingSubscription.save();
      console.log(`✅ Updated subscription for ${user.email}`);
    } else {
      // Create new subscription
      const newSubscription = await Subscription.create({
        userId: user._id,
        plan,
        period,
        startDate,
        endDate,
        stripeSubscriptionId: subscription.id, // Store Stripe subscription ID
      });
      
      // Update user's subscription reference
      user.subscription = newSubscription._id;
      console.log(`✅ Created new subscription for ${user.email}`);
    }

    // Update user's plan
    user.plan = plan;
    await user.save();
    
    console.log(`✅ Updated ${user.email} to premium plan`);
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
  }
};

// Handle subscription events (created/updated)
const handleSubscriptionEvent = async (subscription) => {
  try {
    console.log(`🔍 Processing subscription event: ${subscription.id}`);
    
    // Get customer email from Stripe
    const customer = await stripe.customers.retrieve(subscription.customer);
    const user = await User.findOne({ email: customer.email });
    
    if (!user) {
      console.log(`❌ User not found for customer: ${customer.email}`);
      return;
    }

    // Extract subscription details with proper date conversion
    const plan = "premium"; // All paid subscriptions are premium
    const period = subscription.items.data[0].price.recurring.interval === "month" ? "monthly" : "yearly";
    
    // Handle undefined timestamps - use current time as fallback
    let startDate, endDate;
    
    if (subscription.current_period_start && subscription.current_period_end) {
      // Convert Unix timestamps to JavaScript Date objects
      startDate = new Date(subscription.current_period_start * 1000);
      endDate = new Date(subscription.current_period_end * 1000);
    } else {
      // Fallback: calculate dates based on period
      console.log(`⚠️ Missing period timestamps, calculating fallback dates`);
      startDate = new Date();
      endDate = new Date();
      
      if (period === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
    }
    
    console.log(`📅 Subscription period: ${subscription.current_period_start} to ${subscription.current_period_end}`);
    console.log(`📅 Converted dates - Start: ${startDate.toISOString()}, End: ${endDate.toISOString()}`);

    // Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error(`❌ Invalid dates - Start: ${startDate}, End: ${endDate}`);
      console.error(`❌ Raw timestamps - Start: ${subscription.current_period_start}, End: ${subscription.current_period_end}`);
      return;
    }

    // Check if subscription already exists for this user
    let existingSubscription = await Subscription.findOne({ userId: user._id });
    
    if (existingSubscription) {
      // Update existing subscription
      existingSubscription.plan = plan;
      existingSubscription.period = period;
      existingSubscription.startDate = startDate;
      existingSubscription.endDate = endDate;
      existingSubscription.stripeSubscriptionId = subscription.id; // Store Stripe subscription ID
      await existingSubscription.save();
      console.log(`✅ Updated subscription for ${user.email}`);
    } else {
      // Create new subscription
      const newSubscription = await Subscription.create({
        userId: user._id,
        plan,
        period,
        startDate,
        endDate,
        stripeSubscriptionId: subscription.id, // Store Stripe subscription ID
      });
      
      // Update user's subscription reference
      user.subscription = newSubscription._id;
      console.log(`✅ Created new subscription for ${user.email}`);
    }

    // Update user's plan
    user.plan = plan;
    await user.save();
    
    console.log(`✅ Updated ${user.email} to premium plan`);
  } catch (error) {
    console.error("Error handling subscription event:", error);
  }
};

