// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     Check,
//     Sparkles,
//     Shield,
//     Zap,
//     Star,
//     Layout,
//     Crown,
// } from 'lucide-react';
// import Navbar from '../../home/layouts/Navbar';
// import Sidebar from '@/Features/users/home/layouts/Sidebar';
// import type { RootState } from '@/redux/store';
// import { subscriptionApi } from '@/Services/subscription.api';
// import type { plan } from '../types';
// import { toast } from 'react-hot-toast';

// const SubscriptionPlans = () => {
//     const [plans, setPlans] = useState<plan[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const { currentUser } = useSelector((state: RootState) => state.auth);

//     useEffect(() => {
//         const fetchPlans = async () => {
//             setLoading(true);
//             try {
//                 const response = await subscriptionApi.getPlans();
//                 const activePlans = (response.data || []).filter(
//                     (p: plan) => p.isActive
//                 );
//                 setPlans(
//                     activePlans.sort((a: plan, b: plan) => a.price - b.price)
//                 );
//             } catch (error) {
//                 console.error('Fetch plans error:', error);
//                 setError('Failed to fetch subscription plans');
//                 toast.error('Could not load subscription plans');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchPlans();
//     }, []);

//     const handleCheckout = async (planId: string) => {
//         try {
//             toast.loading('Preparing checkout...', { id: 'checkout' });
//             const response =
//                 await subscriptionApi.createCheckoutSession(planId);
//             if (response.data?.url) {
//                 window.location.href = response.data.url;
//             } else {
//                 throw new Error('No checkout URL received');
//             }
//         } catch (error) {
//             console.error('Checkout error:', error);
//             toast.error('Failed to start checkout process', { id: 'checkout' });
//         }
//     };

//     const getPlanIcon = (name: string) => {
//         const n = name.toLowerCase();
//         if (n.includes('basic') || n.includes('free'))
//             return <Zap className="text-blue-500" size={24} />;
//         if (n.includes('pro') || n.includes('plus'))
//             return <Star className="text-purple-500" size={24} />;
//         if (n.includes('premium') || n.includes('elite'))
//             return <Crown className="text-amber-500" size={24} />;
//         return <Sparkles className="text-indigo-500" size={24} />;
//     };

//     const getPlanAccent = (name: string) => {
//         const n = name.toLowerCase();
//         if (n.includes('pro')) return 'bg-purple-50';
//         if (n.includes('premium')) return 'bg-amber-50';
//         return 'bg-blue-50';
//     };

//     if (error) {
//         return (
//             <div className="min-h-screen flex bg-gray-50">
//                 <Sidebar />
//                 <div className="flex-1 flex flex-col">
//                     <Navbar />
//                     <div className="flex-1 flex items-center justify-center p-6">
//                         <div className="text-center space-y-4 max-w-md">
//                             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
//                                 <Shield size={32} />
//                             </div>
//                             <h2 className="text-2xl font-bold text-gray-900">
//                                 Oops! Something went wrong
//                             </h2>
//                             <p className="text-gray-500">{error}</p>
//                             <button
//                                 onClick={() => window.location.reload()}
//                                 className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
//                             >
//                                 Try Again
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen flex bg-gray-50/50">
//             <Sidebar />

//             <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
//                 <Navbar />

//                 <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
//                     <div className="max-w-6xl mx-auto space-y-12">
//                         {/* Header Section */}
//                         <div className="text-center space-y-4 max-w-3xl mx-auto">
//                             <motion.div
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wide border border-blue-100"
//                             >
//                                 <Sparkles size={16} />
//                                 <span>Upgrade Your Potential</span>
//                             </motion.div>

//                             <motion.h1
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: 0.1 }}
//                                 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight"
//                             >
//                                 Choose the perfect plan for{' '}
//                                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
//                                     your productivity
//                                 </span>
//                             </motion.h1>

//                             <motion.p
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 transition={{ delay: 0.2 }}
//                                 className="text-lg text-gray-500 max-w-2xl mx-auto"
//                             >
//                                 Welcome back,{' '}
//                                 <span className="text-gray-900 font-bold">
//                                     {(currentUser as any)?.name || 'Achiever'}
//                                 </span>
//                                 ! Unlock exclusive features, personalized
//                                 mentorship, and advanced tracking tools to
//                                 accelerate your growth.
//                             </motion.p>
//                         </div>

//                         {/* Plans Grid */}
//                         {loading ? (
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                                 {[1, 2, 3].map((i) => (
//                                     <div
//                                         key={i}
//                                         className="bg-white rounded-3xl p-8 h-[500px] border border-gray-100 animate-pulse space-y-6"
//                                     >
//                                         <div className="h-8 w-32 bg-gray-100 rounded-lg"></div>
//                                         <div className="h-12 w-24 bg-gray-100 rounded-lg"></div>
//                                         <div className="space-y-3">
//                                             {[1, 2, 3, 4, 5].map((j) => (
//                                                 <div
//                                                     key={j}
//                                                     className="h-4 w-full bg-gray-50 rounded"
//                                                 ></div>
//                                             ))}
//                                         </div>
//                                         <div className="h-12 w-full bg-gray-100 rounded-xl mt-auto"></div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pb-10">
//                                 <AnimatePresence mode="popLayout">
//                                     {plans.map((plan, index) => (
//                                         <motion.div
//                                             key={plan._id}
//                                             initial={{
//                                                 opacity: 0,
//                                                 scale: 0.95,
//                                                 y: 30,
//                                             }}
//                                             animate={{
//                                                 opacity: 1,
//                                                 scale: 1,
//                                                 y: 0,
//                                             }}
//                                             transition={{
//                                                 delay: index * 0.1,
//                                                 duration: 0.5,
//                                                 type: 'spring',
//                                             }}
//                                             whileHover={{ y: -8 }}
//                                             className={`relative flex flex-col bg-white rounded-[2rem] p-8 transition-all duration-300 border border-gray-100 shadow-sm hover:shadow-2xl group ${
//                                                 plan.name
//                                                     .toLowerCase()
//                                                     .includes('pro')
//                                                     ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-transparent'
//                                                     : ''
//                                             }`}
//                                         >
//                                             {plan.name
//                                                 .toLowerCase()
//                                                 .includes('pro') && (
//                                                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg z-10 uppercase tracking-tighter">
//                                                     Most Popular
//                                                 </div>
//                                             )}

//                                             <div className="flex justify-between items-start mb-6">
//                                                 <div
//                                                     className={`p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 ${getPlanAccent(plan.name)}`}
//                                                 >
//                                                     {getPlanIcon(plan.name)}
//                                                 </div>
//                                                 <div className="text-right">
//                                                     <span className="block text-sm font-bold text-gray-400 tracking-wider uppercase">
//                                                         {plan.billingCycleDays}{' '}
//                                                         Days
//                                                     </span>
//                                                 </div>
//                                             </div>

//                                             <div className="space-y-4 mb-8">
//                                                 <h2 className="text-2xl font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors">
//                                                     {plan.name}
//                                                 </h2>
//                                                 <div className="flex items-baseline gap-1">
//                                                     <span className="text-4xl font-black text-gray-900">
//                                                         ₹{plan.price}
//                                                     </span>
//                                                     <span className="text-gray-400 font-medium">
//                                                         /{plan.billingCycleDays}
//                                                         d
//                                                     </span>
//                                                 </div>
//                                             </div>

//                                             {/* Features List */}
//                                             <div className="flex-1 space-y-6 mb-10">
//                                                 <div className="space-y-3">
//                                                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
//                                                         Included Features
//                                                     </p>
//                                                     <ul className="space-y-3">
//                                                         {plan.features.map(
//                                                             (feature, i) => (
//                                                                 <li
//                                                                     key={i}
//                                                                     className="flex items-start gap-3 text-gray-600 group/item"
//                                                                 >
//                                                                     <div className="mt-1 p-0.5 rounded-full bg-green-100 text-green-600 group-hover/item:bg-green-600 group-hover/item:text-white transition-colors duration-200">
//                                                                         <Check
//                                                                             size={
//                                                                                 12
//                                                                             }
//                                                                             strokeWidth={
//                                                                                 4
//                                                                             }
//                                                                         />
//                                                                     </div>
//                                                                     <span className="text-sm font-medium">
//                                                                         {
//                                                                             feature
//                                                                         }
//                                                                     </span>
//                                                                 </li>
//                                                             )
//                                                         )}
//                                                     </ul>
//                                                 </div>

//                                                 {plan.limitations &&
//                                                     Object.keys(
//                                                         plan.limitations
//                                                     ).length > 0 && (
//                                                         <div className="space-y-3 pt-4 border-t border-gray-50">
//                                                             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
//                                                                 Capacity &
//                                                                 Limits
//                                                             </p>
//                                                             <div className="grid grid-cols-2 gap-2">
//                                                                 {Object.entries(
//                                                                     plan.limitations
//                                                                 ).map(
//                                                                     (
//                                                                         [
//                                                                             key,
//                                                                             value,
//                                                                         ],
//                                                                         i
//                                                                     ) => (
//                                                                         <div
//                                                                             key={
//                                                                                 i
//                                                                             }
//                                                                             className="bg-gray-50 rounded-xl p-3 border border-gray-100"
//                                                                         >
//                                                                             <p className="text-[10px] font-bold text-gray-400 uppercase truncate">
//                                                                                 {key.replace(
//                                                                                     /([A-Z])/g,
//                                                                                     ' $1'
//                                                                                 )}
//                                                                             </p>
//                                                                             <p className="text-lg font-black text-gray-900">
//                                                                                 {
//                                                                                     value
//                                                                                 }{' '}
//                                                                                 per
//                                                                                 month
//                                                                             </p>
//                                                                         </div>
//                                                                     )
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                             </div>

//                                             <button
//                                                 onClick={() =>
//                                                     handleCheckout(plan._id)
//                                                 }
//                                                 className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 transform group-active:scale-95 shadow-lg ${
//                                                     plan.name
//                                                         .toLowerCase()
//                                                         .includes('pro')
//                                                         ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/25'
//                                                         : 'bg-gray-900 text-white hover:bg-black hover:shadow-gray-500/25'
//                                                 }`}
//                                             >
//                                                 Get Started with {plan.name}
//                                             </button>
//                                         </motion.div>
//                                     ))}
//                                 </AnimatePresence>
//                             </div>
//                         )}

//                         {/* Footer / FAQ Redirect */}
//                         <div className="text-center py-10">
//                             <p className="text-gray-500">
//                                 Have questions about our plans?{' '}
//                                 <a
//                                     href="#"
//                                     className="text-blue-600 font-bold hover:underline"
//                                 >
//                                     Contact our support team
//                                 </a>
//                             </p>
//                             <div className="flex justify-center gap-8 mt-6">
//                                 <div className="flex items-center gap-2 text-gray-400">
//                                     <Shield size={16} />
//                                     <span className="text-xs font-medium">
//                                         Secure Payments
//                                     </span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-gray-400">
//                                     <Layout size={16} />
//                                     <span className="text-xs font-medium">
//                                         Cancel Anytime
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default SubscriptionPlans;
