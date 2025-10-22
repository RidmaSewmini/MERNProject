import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Optional: Fetch session details from backend
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/subscription/session/${sessionId}`);
        const data = await res.json();
        setSession(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-titillium">
      <CheckCircle size={80} className="text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-6">
        Thank you for your purchase. Your subscription is now active.
      </p>

      {session && (
        <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <p><strong>Email:</strong> {session.customer_email}</p>
          <p><strong>Amount Paid:</strong> ${session.amount_total / 100}</p>
        </div>
      )}

      <a
        href="/"
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Go to Homepage
      </a>
    </div>
  );
};

export default PaymentSuccess;