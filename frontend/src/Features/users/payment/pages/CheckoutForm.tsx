// import  { useState } from 'react';
// import { useStripe } from '@stripe/react-stripe-js';
// import type { RootState } from '@/redux/store';
// // import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';

// const plans = [
//   {
//     id: 'price_1S4pLoB0Ekw2NoJyZXqhIG9Z',
//     name: 'Basic',
//     price: '₹1,000.00',
//     description: 'Good for starters',
//   },
//   {
//     id: 'price_1S4pLoB0Ekw2NoJyZXqhIG9Z',
//     name: 'Pro',
//     price: '₹1,500.00',
//     description: 'Best for regular learners',
//   },
//   {
//     id: 'price_1S4pMyB0Ekw2NoJyMRYoEB3q',
//     name: 'Premium',
//     price: '₹2,000.00',
//     description: 'All features unlocked',
//   },
// ];
// const SubscriptionForm = () => {
//   const stripe = useStripe();
//   const [loading, setLoading] = useState<string | boolean>(false);
//   const [message, setMessage] = useState('');
//   // const dispatch = useDispatch<AppDispatch>();
//   const { user } = useSelector((state: RootState) => state.auth);

//   async function handleSubscribe(priceId: string) {
//     if (!stripe) return;
//     setLoading(priceId);
//     setMessage('');

//     try {
//       // 1️⃣ Call backend to create a Checkout Session
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/payments/checkout`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             userId: user?.id,
//             priceId,
//             successUrl: window.location.origin + '/success',
//             cancelUrl: window.location.origin + '/cancel',
//           }),
//         },
//       );

//       const { sessionId } = await res.json();

//       // 2️⃣ Redirect to Stripe Checkout
//       const result = await stripe.redirectToCheckout({ sessionId });

//       if (result.error) {
//         setMessage(result.error?.message ?? 'something went wrong');
//       }
//     } catch (error) {
//       setMessage('❌ Something went wrong:');
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
//       {plans.map((plan) => (
//         <div
//           key={plan.id}
//           style={{
//             border: '1px solid #ddd',
//             padding: '20px',
//             borderRadius: '10px',
//             width: '250px',
//             textAlign: 'center',
//           }}
//         >
//           <h3>{plan.name}</h3>
//           <p>{plan.description}</p>
//           <h2>{plan.price}</h2>
//           <button
//             onClick={() => handleSubscribe(plan.id)}
//             disabled={!stripe || loading === plan.id}
//             style={{
//               marginTop: '10px',
//               padding: '10px 20px',
//               background: '#6772e5',
//               color: '#fff',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//             }}
//           >
//             {loading === plan.id ? 'Processing…' : 'Subscribe'}
//           </button>
//         </div>
//       ))}
//       {message && <p style={{ marginTop: '20px', color: 'red' }}>{message}</p>}
//     </div>
//   );
// };

// export default SubscriptionForm;

// SubscriptionForm.tsx
import { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import SubscriptionInfo from './SubscriptionInfo';

const plans = [
  {
    id: 'price_1SAOE4B0Ekw2NoJyBHjx4edX',
    name: 'Basic',
    price: '₹200',
    description: '2 sessions per week',
    duration: '1 week',
    sessions: 2,
    features: ['1 hour per session', 'Mentorship included'],
  },
  {
    id: 'price_1S4pOZB0Ekw2NoJy6Eq6QL7F',
    name: 'Pro',
    price: '₹500',
    description: '5 sessions in 2 weeks',
    duration: '2 weeks',
    sessions: 5,
    features: [
      '1 hour per session',
      'Mentorship included',
      'Progress tracking',
    ],
    popular: true, // highlight this plan
  },
  {
    id: 'price_1SAOAqB0Ekw2NoJysDIkJTrs',
    name: 'Premium',
    price: '₹900',
    description: '10 sessions in 1 month',
    duration: '1 month',
    sessions: 10,
    features: [
      '1 hour per session',
      'Mentorship included',
      'Progress tracking',
      'Priority support',
    ],
  },
];

const SubscriptionForm = () => {
  const stripe = useStripe();
  const [loading, setLoading] = useState<string | boolean>(false);
  const [message, setMessage] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);

  async function handleSubscribe(planId: string) {
    if (!stripe) return;
    setLoading(planId);
    setMessage('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/payments/checkout`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            priceId: planId,
            successUrl: window.location.origin + '/success',
            cancelUrl: window.location.origin + '/cancel',
          }),
        },
      );

      const { sessionId } = await res.json();
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error)
        setMessage(result.error?.message ?? 'Something went wrong');
    } catch (error) {
      setMessage('❌ Something went wrong');
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 p-6">
        {user?.subscription?.status ==="active" && (
          <SubscriptionInfo subscription={user.subscription} />
        )}
      </div>
      <div className="flex flex-col items-center bg-white py-12 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Choose Your Plan
        </h2>
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative border rounded-xl p-6 flex flex-col justify-between shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2
              ${plan.popular ? 'border-[#7F00FF] bg-purple-50 scale-105' : 'border-gray-200'}
            `}
            >
              {plan.popular && (
                <span className="absolute top-0 right-0 bg-[#7F00FF] text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                  {plan.price}
                </h2>
                <ul className="text-gray-700 mb-6 space-y-1">
                  <li>
                    <strong>Sessions:</strong> {plan.sessions}
                  </li>
                  <li>
                    <strong>Duration:</strong> {plan.duration}
                  </li>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      ✅ {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={!stripe || loading === plan.id}
                className={`mt-auto py-3 px-6 rounded-lg font-semibold text-white transition
                ${plan.popular ? 'bg-[#7F00FF] hover:bg-purple-700' : 'bg-gray-800 hover:bg-gray-900'}
              `}
              >
                {loading === plan.id ? 'Processing…' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>

        {message && <p className="text-red-500 mt-6">{message}</p>}
      </div>
    </>
  );
};

export default SubscriptionForm;
