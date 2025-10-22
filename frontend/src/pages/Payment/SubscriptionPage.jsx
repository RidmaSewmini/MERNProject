import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "../../components/card";
import { Badge } from "../../components/badge";
import { Check } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PaymentModal from "../../components/PaymentModal";
import { useAuthStore } from "../../store/authStore";

// Pricing data
const pricingList = [
  {
    key: "free",
    title: "Free",
    popular: false,
    price: 0,
    description: "This plan is for everyone who registers.",
    buttonText: "Get Started",
    benefitList: ["2 Selling Items per Month", "Limited to warranty period support", "10% Commission", "Standard Email - Technician support"],
    billing: "/month",
    plan: "free",
    period: "monthly",
  },
  {
    key: "premium-monthly",
    title: "Premium",
    popular: true,
    price: 1.49,
    description: "Premium monthly plan",
    buttonText: "Buy Monthly",
    benefitList: ["5 Selling Items per Month", "Lifetime Service Package", "5% Commission", "5% Rental Discount", "Priority Chat Customer support"],
    billing: "/month",
    plan: "premium",
    period: "monthly",
  },
  {
    key: "premium-yearly",
    title: "Enterprise",
    popular: false,
    price: 2.99,
    description: "Premium yearly plan",
    buttonText: "Buy Yearly",
    benefitList: ["Unlimited Selling Items", "Lifetime Service + Hardware Package ", "2% Commission", " 5% Rental Discount", "VIP 24/7 Phone Customer Support"],
    billing: "/year",
    plan: "premium",
    period: "yearly",
  },
];

export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Handle plan selection
  const handlePlanClick = async (plan) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (plan.plan === "free") {
      // Free plan → show modal
      setSelectedPlan(plan);
      setShowModal(true);
      return;
    }

    // Paid plan → call backend to create checkout session
    try {
      const res = await fetch("http://localhost:5001/api/subscription/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.plan, period: plan.period, userId: user._id }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        alert("Failed to create checkout session");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating checkout session");
    }
  };

  return (
    <div 
      className="flex flex-col min-h-screen font-titillium"
      style={{
        backgroundImage: "url('https://cdn.dribbble.com/userupload/36574283/file/original-f3b3b7f534efce1264aeedb9399dd2e8.jpg?resize=1504x1003&vertical=center')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed"
      }}
    >
      <Navbar />

      <section className="flex-1 flex flex-col justify-center items-center px-4 py-24 sm:py-32 w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Get{" "}
          <span className="bg-gradient-to-b from-[#667EEA] to-[#764BA2] uppercase text-transparent bg-clip-text">
            Unlimited
          </span>{" "}
          Access
        </h2>
        <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
          Choose a plan that fits your needs.
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl justify-center">
          {pricingList.map((pricing) => (
            <Card
              key={pricing.key}
              className={`w-80 rounded-xl ${pricing.popular ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {pricing.title}
                  {pricing.popular && (
                    <Badge variant="secondary" className="text-sm text-black">
                      Most popular
                    </Badge>
                  )}
                </CardTitle>

                <div className="mt-2">
                  <span className="text-3xl font-bold">${pricing.price}</span>
                  <span className="text-muted-foreground"> {pricing.billing}</span>
                </div>

                <CardDescription>{pricing.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div>
                  {pricing.benefitList.map((b) => (
                    <div key={b} className="flex items-center gap-2 mb-2">
                      <Check className="text-purple-500" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <hr className="w-4/5 m-auto mb-4" />

              <CardFooter className="flex justify-between items-center">
                <div />
                <button
                  onClick={() => handlePlanClick(pricing)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    pricing.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {pricing.buttonText}
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {showModal && selectedPlan && (
          <PaymentModal
            plan={selectedPlan.plan}
            period={selectedPlan.period}
            price={selectedPlan.price}
            onClose={() => {
              setShowModal(false);
              setSelectedPlan(null);
            }}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
0