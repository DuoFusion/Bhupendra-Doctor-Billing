import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signinUser } from "../../api/authApi";
import { ROUTES } from "../../constants/Routes";

const SigninForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: signinUser,
    onSuccess: () => {
      localStorage.setItem("email", email);

      alert("OTP sent successfully to " + email);
      navigate(ROUTES.AUTH.VERIFY_OTP);
    },
  });

  const handleSignin = () => {
    mutation.mutate({ email, password });
  };

  const getErrorMessage = () => {
    if (axios.isAxiosError(mutation.error)) {
      return mutation.error.response?.data?.message;
    }
    return "Something went wrong";
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <span
            className="text-indigo-400 cursor-pointer ml-1 flex justify-end"
            onClick={() => navigate(ROUTES.AUTH.FORGET_PASSWORD)}
          >
            Forget Password ?
          </span>

          <button
            onClick={handleSignin}
            disabled={mutation.isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-md font-medium transition"
          >
            {mutation.isPending ? "Signing in..." : "Sign In"}
          </button>

          {mutation.isError && (
            <p className="text-red-400 text-sm text-center">
              {getErrorMessage()}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-400 text-center mt-6">
          Don’t have an account?
          <span
            className="text-indigo-400 cursor-pointer ml-1"
            onClick={() => navigate(ROUTES.AUTH.SIGNUP)}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SigninForm;
