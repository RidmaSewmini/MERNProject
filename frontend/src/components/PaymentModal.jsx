import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Vite env example: VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ModalShell = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-[460px] max-h-[90vh] p-0 overflow-hidden">
      <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
        <h3 className="text-white font-semibold text-lg">Enter Card Details</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">✕</button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const CheckoutForm = ({ plan, period, price, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuthStore(); // provides user and token
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!stripe || !elements) {
      setMessage("Stripe not loaded");
      setLoading(false);
      return;
    }

    try {
      // 1) create payment method
      const cardElement = elements.getElement(CardElement);
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (pmError) {
        setMessage(pmError.message);
        setLoading(false);
        return;
      }

      // 2) call backend to create subscription
      // backend expects: { userId, plan, period, paymentMethodId }
      const token = user?.token;
      const res = await axios.post(
        "/api/subscription/create",
        {
          userId: user._id,
          plan,
          period,
          paymentMethodId: paymentMethod.id,
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        }
      );

      const { clientSecret, subscription } = res.data;

      // 3) confirm the payment intent returned from backend
      if (!clientSecret) {
        // may be free plan or error
        setMessage("No client secret returned. Subscription might be free or failed.");
        setLoading(false);
        return;
      }

      const confirm = await stripe.confirmCardPayment(clientSecret);

      if (confirm.error) {
        setMessage(confirm.error.message || "Payment confirmation failed");
        setLoading(false);
        return;
      }

      if (confirm.paymentIntent && confirm.paymentIntent.status === "succeeded") {
        setMessage("Payment successful — subscription active.");
        onSuccess && onSuccess(subscription);
      } else {
        setMessage("Payment processed. Check your subscription status in account.");
        onSuccess && onSuccess(subscription);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || err.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Card</label>
        <div className="border border-gray-300 rounded p-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          {loading ? "Processing..." : `Pay $${price} / ${period}`}
        </button>
      </div>

      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
};

export default function PaymentModal({ plan, period, price, onClose }) {
  const handleSuccess = (subscription) => {
    // optionally show toast or redirect
    onClose();
    window.location.reload(); // or update store/profile
  };

  return (
    <ModalShell onClose={onClose}>
      <Elements stripe={stripePromise}>
        <CheckoutForm plan={plan} period={period} price={price} onSuccess={handleSuccess} onClose={onClose} />
      </Elements>
    </ModalShell>
  );
}
