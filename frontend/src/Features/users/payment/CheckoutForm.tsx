import React, { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import type { AppDispatch, RootState } from "@/redux/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


const plans = [
  {
    id: "price_1S4pLoB0Ekw2NoJyZXqhIG9Z", 
    name: "Basic",
    price:"₹1,000.00",
    description: "Good for starters",
  },
  {
    id: "price_1S4pLoB0Ekw2NoJyZXqhIG9Z",
    name: "Pro",
    price: "₹1,500.00",
    description: "Best for regular learners",
  },
  {
    id: "price_1S4pMyB0Ekw2NoJyMRYoEB3q",
    name: "Premium",
    price: "₹2,000.00",
    description: "All features unlocked",
  },
];
const SubscriptionForm = () => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); 
  const dispatch = useDispatch<AppDispatch>();
   const { user} = useSelector((state: RootState) => state.auth);
  
  async function handleSubscribe(priceId: string) {
    if (!stripe) return;
    setLoading(priceId);
    setMessage("");

    try {
      // 1️⃣ Call backend to create a Checkout Session
      const res = await fetch(`${import.meta.env.VITE_API_URL}/payments/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          priceId,
          successUrl: window.location.origin + "/success",
          cancelUrl: window.location.origin + "/cancel",
        }),
      });

      const { sessionId } = await res.json();

      // 2️⃣ Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        setMessage(result.error.message);
      }
    } catch (error: any) {
      setMessage("❌ Something went wrong: " + error.message);
    } finally {
      setLoading(false);
    }
  }

   return (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
      {plans.map((plan) => (
        <div
          key={plan.id}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "10px",
            width: "250px",
            textAlign: "center",
          }}
        >
          <h3>{plan.name}</h3>
          <p>{plan.description}</p>
          <h2>{plan.price}</h2>
          <button
            onClick={() => handleSubscribe(plan.id)}
            disabled={!stripe || loading === plan.id}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              background: "#6772e5",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading === plan.id ? "Processing…" : "Subscribe"}
          </button>
        </div>
      ))}
      {message && <p style={{ marginTop: "20px", color: "red" }}>{message}</p>}
    </div>
  );
};


export default SubscriptionForm;
