import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../api/authApi";
import { ROUTES } from "../../constants/Routes";

const SignupForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role] = useState("user");

  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      navigate(ROUTES.AUTH.SIGNIN);
      alert("Signup successfull !");
    },
  });

  const handleSignup = () => {
    mutation.mutate({ name, email, password, role }); 
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
          Create Your Account
        </h2>
        <p className="mb-6 text-center text-sm text-slate-400">
          Set up your account details to get started
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Medical Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-[#2a466f]/55 bg-[#0a1a31] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/70 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />

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

          <input
            type="text"
            value={role}
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-[#122742] px-4 py-3 text-sm text-slate-400"
          />

          <button
            onClick={handleSignup}
            disabled={mutation.isPending}
            className="w-full rounded-xl bg-[#177db8] py-3 text-sm font-medium text-white transition hover:bg-[#1f8bcb] disabled:opacity-60"
          >
            {mutation.isPending ? "Creating..." : "Sign Up"}
          </button>

          {mutation.isError && (
            <p className="text-red-400 text-sm text-center">
              {getErrorMessage()}
            </p>
          )}
        </div>

        <p className="text-sm text-slate-400 text-center mt-6">
          Already have an account?
          <span
            className="text-sky-300 cursor-pointer ml-1"
            onClick={() => navigate(ROUTES.AUTH.SIGNIN)}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;

