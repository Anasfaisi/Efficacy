// client/src/pages/Login.tsx
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { login } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/types/authSchema";
import { useForm } from "react-hook-form";

const Login = () => {
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { isLoading, error, accessToken} = useAppSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
  });

  // useEffect(() => {
  //   console.log("reached in login")
  //   if (!accessToken) {
  //     console.log("Token detected in useEffect:", accessToken);
  //     navigate("/login");
  //   }
  // }, [accessToken]);

  const onSubmit = async (data: loginFormSchema) => {
    const result = await dispatch(login({ ...data, role: 'user' }));
    if (login.fulfilled.match(result)) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className={cn("w-full max-w-md p-6 bg-white rounded-xl shadow-lg")}>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...formRegister("email")}
              placeholder="Enter your email"
              className={cn(
                "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                errors.email && "border-red-500"
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...formRegister("password")}
              placeholder="Enter your password"
              className={cn(
                "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                errors.password && "border-red-500"
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <button
            type="submit"
            className={cn(
              "w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500",
              { "opacity-50 cursor-not-allowed": isLoading }
            )}
            disabled={isLoading}
          >
            {isLoading ? "Logging in ..." : "Log in"}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <p className="text-sm text-gray-500 text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="hover:text-gray-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
