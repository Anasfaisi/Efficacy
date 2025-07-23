// // client/src/pages/Register.tsx
// import React, { useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '../../redux/hooks';
// import { register } from '../../redux/slices/authSlice';
// import { useNavigate } from 'react-router-dom';
// import { cn } from '../../lib/utils';
import { Link } from "react-router-dom";

// const Register: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { isLoading, error, token } = useAppSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const [confirmPassword, setConfirmPassword] = React.useState('');
//   const [name, setName] = React.useState('');

//   useEffect(() => {
//     if (token) {
//       navigate('/dashboard');
//     }
//   }, [token, navigate]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       // Basic client-side validation
//       return;
//     }
//     const result = await dispatch(register({ email, password, name }));
//     if (register.fulfilled.match(result)) {
//       navigate('/dashboard');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black-200">
//       <div className={cn('w-full max-w-md p-6 bg-white rounded-xl shadow-lg')}>
//         <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Create Your Account</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter your name"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm your password"
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className={cn(
//               'w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500',
//               { 'opacity-50 cursor-not-allowed': isLoading }
//             )}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Registering...' : 'Sign Up'}
//           </button>
//           {error && <p className="text-red-500 text-sm text-center">{error}</p>}
//           <p className="text-sm text-gray-500 text-center">
//             Already have an account?{' '}
//             <a href="/login" className="hover:text-gray-700 hover:underline">
//               Log in
//             </a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React,{useEffect ,useState} from "react";
import { useAppDispatch,useAppSelector } from "@/redux/hooks";
import {register} from "../../redux/slices/authSlice"
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Register: React.FC =()=>{
  const dispatch = useAppDispatch();
  const {isLoading,error,token}=useAppSelector((state)=>state.auth)
  const navigate = useNavigate()
  const [email,setEmail]=useState('')
  const [password,setPassword]= useState('')
  const [confirmPassword ,setConfirmPassword]=useState("")
  const [name ,setName]=useState('')
  
  useEffect(()=>{
    if(token){
      navigate('/dashboard')
    }
  },[token, navigate])

 const handleSubmit = async(e:React.FormEvent)=>{
  e.preventDefault();
  if(password !== confirmPassword){
    return
  }
  const result = await dispatch( register({email,password,name}))
  if(register.fulfilled.match(result)){
    navigate('/dashboard')
  }
 } 

 return (
  <div className="min-h-screen flex items-center justify-center bg-black-200" >
    <div className={cn('w-full max-w-md p-6 bg-white rounded-xl shadow-lg')}>
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8"> Create your Account </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input 
          type="text"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required/>

        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder = "Enter your email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />

        </div>
        <div>
          <label className="block">Password</label>
          <input 
          type="password"
          value ={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline focus:ring-2 focus:ring-purple-500 focus:border-r-transparent"
          />
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
      
          <button
          type="submit"
          className={cn(
            'w-full bg-purple-600 text-white p-3 rounded-lg hover:bg:purple-700 active:bg-purple-800 focus:outline-noen focus:ring-2 focus:ring-purple-500',
            {'opacity-50 cursor-not-allowed':isLoading}
          )}
          disabled ={isLoading}>
            {isLoading?"Registering..":"Sign up"}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <p className="text-sm text-gray-500 text-center">Already have an account {''}<Link to='/login' className="hover:text-gray-700 hover:underline">Log In</Link> </p>
      </form>
    </div>
  </div>
 )

}
export default Register