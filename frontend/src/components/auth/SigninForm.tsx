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
      <div className="w-full max-w-md rounded-2xl bg-[#0b172a]/95 p-8 ring-1 ring-white/5">
        <h2 className="mb-2 text-center text-2xl font-medium text-slate-100">
          Welcome Back
        </h2>
        <p className="mb-6 text-center text-sm text-slate-400">
          Sign in to continue to your dashboard
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#2a466f]/55 bg-[#0a1a31] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/70 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[#2a466f]/55 bg-[#0a1a31] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/70 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />
          <span
            className="ml-1 flex cursor-pointer justify-end text-sm text-sky-300 transition hover:text-sky-200"
            onClick={() => navigate(ROUTES.AUTH.FORGET_PASSWORD)}
          >
            Forget Password ?
          </span>

          <button
            onClick={handleSignin}
            disabled={mutation.isPending}
            className="w-full rounded-xl bg-[#177db8] py-3 text-sm font-medium text-white transition hover:bg-[#1f8bcb] disabled:opacity-60"
          >
            {mutation.isPending ? "Signing in..." : "Sign In"}
          </button>

          {mutation.isError && (
            <p className="text-red-400 text-sm text-center">
              {getErrorMessage()}
            </p>
          )}
        </div>

        <p className="text-sm text-slate-400 text-center mt-6">
          Don’t have an account?
          <span
            className="text-sky-300 cursor-pointer ml-1"
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

