// import { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// // import { useAppDispatch} from '@/redux/hooks';
// // import { forgotPasswordRequest, resetPassword } from "@/redux/slices/authSlice";
// import { forgotPasswordApi, resetPasswordApi } from '@/Services/auth.api';
// import { AuthMessages } from '@/utils/Constants';
// import { useForm } from 'react-hook-form';
// import { forgotPasswordSchema } from '@/types/authSchema';
// import { zodResolver } from '@hookform/resolvers/zod';

// export function ForgotResetPassword() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const token = queryParams.get('token');
//   const navigate = useNavigate();
//   const {
//     register: formRegister,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<forgotPasswordSchema>({
//     resolver: zodResolver(forgotPasswordSchema),
//     mode: 'onChange',
//   });

//   // const dispatch = useAppDispatch();

//   const onSubmit = async (data:forgotPasswordSchema) => {
//     e.preventDefault();
//     setErrorMessage('');
//     setSuccessMessage('');
//     setIsLoading(true);

//     try {
//       if (token) {
//         if (password !== confirmPassword) {
//           setErrorMessage('Passwords do not match');
//           setIsLoading(false);
//           return;
//         }
//         const result = await resetPasswordApi(token, password);
//         if (result) {
//           setSuccessMessage(result.message);
//           setTimeout(() => navigate('/login'), 1500);
//         } else {
//           setErrorMessage(AuthMessages.ResetPasswordFailed);
//         }
//       } else {
//         const result = await forgotPasswordApi(email);
//         if (result) {
//           setSuccessMessage(result.message);
//         } else {
//           setErrorMessage(AuthMessages.ForgotFailed);
//         }
//       }
//     } catch (err) {
//       setErrorMessage(AuthMessages.ResetPasswordFailed);
//       console.log(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
{
  /* <div className="min-h-screen  flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
  <div className="w-full  max-w-md bg-white shadow-xl p-8 rounded-2xl border border-purple-300 ">
    <h2 className="text-3xl font-bold text-purple-900 text-center mb-1">
      {token ? 'Reset Password' : 'Forgot Password'}
    </h2>
    <p className="text-gray-600 text-center mb-6">
      {token
        ? 'Enter your new password below'
        : 'Enter your email and we’ll send you a reset link'}
    </p>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto"
    >
      {!token && (
        <div>
          <input
            type="email"
            {...formRegister('email')}
            placeholder="Enter your email"
            value={email}
            // onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none tranistion"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      )}
      {token && (
        <div>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition focus:outline-none"
            required
          />
        </div>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 bg-purple-600 text-white  font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 "
      >
        {isLoading
          ? token
            ? 'Resetting...'
            : 'Sending...'
          : token
            ? 'Reset Password'
            : 'Send Reset Link'}
      </button>
    </form>
    {errorMessage && (
      <p className="text-red-600 text-center mt-4">{errorMessage}</p>
    )}
    {successMessage && (
      <p className="text-green-600 text-center mt-4">
        {successMessage}{' '}
        {token && (
          <button
            className="underline text-purple-700 ml-2"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </p>
    )}
  </div>
</div>; */
}
//   );
// }

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { forgotPasswordSchema } from '@/types/zodSchemas'; // z.object({ email: z.string().email() })
// import { forgotPasswordApi, resetPasswordApi } from '@/Services/auth.api';
// import { AuthMessages } from '@/utils/Constants';
// import { useNavigate } from 'react-router-dom';
// import type { z } from 'zod';
// import { toast } from 'react-toastify';

// type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// export const ForgotResetPassword: React.FC = () => {
//   const navigate = useNavigate();
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   // assume you already got token from URL:
//   const token = new URLSearchParams(location.search).get('token');
//   // const token = null; // <-- replace with your real token logic

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ForgotPasswordFormValues>({
//     resolver: zodResolver(forgotPasswordSchema),
//     mode: 'onChange',
//   });
//   const passwordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//   const onSubmit = async (data: ForgotPasswordFormValues) => {
//     console.log("it is reachign in onsubmit")
//     setErrorMessage('');
//     setSuccessMessage('');
//     setIsLoading(true);

//     try {
//       if (token) {

//              if (!passwordRegex.test(password)) {
//           setErrorMessage(
//             'Password must be at least 8 characters, include uppercase, lowercase, number, and a special character.'
//           );
//           setIsLoading(false);
//           return;
//         }

//         if (password !== confirmPassword) {
//           setErrorMessage('Passwords do not match');
//           setIsLoading(false);
//           return;
//         }

//         const result = await resetPasswordApi(token, password);
//         console.log(result, 'from rest tsx');
//         if (result) {
//           setSuccessMessage(result.message);
//           setTimeout(() => navigate('/login'), 1500);
//         } else {
//           setErrorMessage(AuthMessages.ResetPasswordFailed);
//         }
//       } else {
//         const result = await forgotPasswordApi(data.email);
//         console.log(result, 'from tsx');
//         if (result) {
//           setSuccessMessage(result.message);
//         } else {
//           setErrorMessage(AuthMessages.ForgotFailed);
//         }
//       }
//     } catch (err) {
//       toast.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen  flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
//       <div className="w-full  max-w-md bg-white shadow-xl p-8 rounded-2xl border border-purple-300 ">
//         <h2 className="text-3xl font-bold text-purple-900 text-center mb-1">
//           {token ? 'Reset Password' : 'Forgot Password'}
//         </h2>
//         <form
//           className="space-y-4"
//           onSubmit={handleSubmit(onSubmit)} // <- RHF submit
//         >
//           {!token && (
//             <div>
//               <input
//                 type="email"
//                 {...register('email')}
//                 required
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>
//           )}

//           {token && (
//             <div>
//               <input
//                 type="password"
//                 placeholder="New password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
//               />

//               <input
//                 type="password"
//                 placeholder="Confirm new password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none mt-2"
//               />

//             </div>
//           )}

//           {errorMessage && (
//             <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
//           )}
//           {successMessage && (
//             <p className="text-green-500 text-sm mt-1">{successMessage}</p>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-2 bg-purple-600 text-white  font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 "
//           >
//             {isLoading
//               ? token
//                 ? 'Resetting...'
//                 : 'Sending...'
//               : token
//                 ? 'Reset Password'
//                 : 'Send Reset Link'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

import React, { useState, type HtmlHTMLAttributes } from 'react';
import { forgotPasswordApi, resetPasswordApi } from '@/Services/auth.api';
import { AuthMessages } from '@/utils/Constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ForgotResetPassword: React.FC = () => {
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  // State-based form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password validation regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handlePassword = (data: string) => {
    if (!passwordRegex.test(data)) {
      setErrorMessage(
        'Password must be at least 8 characters, contain uppercase, lowercase, number, and special character.',
      );
    } else {
      setErrorMessage('');
    }
    setPassword(data);
  };
  const handleConfirmPassword = (data: string) => {
    if (!passwordRegex.test(data)) {
      setErrorMessage(
        'Password must be at least 8 characters, contain uppercase, lowercase, number, and special character.',
      );
    } else {
      setErrorMessage('');
    }
    setConfirmPassword(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (token) {
        if (!passwordRegex.test(password)) {
          setErrorMessage(
            'Password must be at least 8 characters, contain uppercase, lowercase, number, and special character.',
          );
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setIsLoading(false);
          return;
        }

        const result = await resetPasswordApi(token, password);
        if (result) {
          setTimeout(() => navigate('/login'), 1500);
          toast.success(result.message);
        } else {
          setErrorMessage(AuthMessages.ResetPasswordFailed);
        }

        return;
      } else {
        if (!email) {
          setErrorMessage('Email is required');
          setIsLoading(false);
          return;
        }
        if (emailRegex.test(email) == false) {
          setErrorMessage('please Enter a valid email');
          return;
        }
        const result = await forgotPasswordApi(email);
        if (result) {
          setSuccessMessage(result.message);
        } else {
          setErrorMessage(AuthMessages.ForgotFailed);
        }
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl p-8 rounded-2xl border border-purple-300">
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-3">
          {token ? 'Reset Password' : 'Forgot Password'}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* EMAIL FIELD */}
          {!token && (
            <div>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          )}

          {/* PASSWORD FIELDS */}
          {token && (
            <>
              <input
                type="password"
                value={password}
                placeholder="New Password"
                onChange={(e) => handlePassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm New Password"
                onChange={(e) => handleConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </>
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading
              ? token
                ? 'Resetting...'
                : 'Sending...'
              : token
                ? 'Reset Password'
                : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};
