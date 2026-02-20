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
      alert("Signup successfull !")
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
      <div className="w-full max-w-md bg-[#0b172a]/95 border border-[#1e3354] rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Your Account
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Medical Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f2037] rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f2037] rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f2037] rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />

          <input
            type="text"
            value={role}
            disabled
            className="w-full px-4 py-3 bg-[#1f334f] text-slate-400 rounded-md cursor-not-allowed"
          />

          <button
            onClick={handleSignup}
            disabled={mutation.isPending}
            className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 py-3 rounded-md font-medium transition"
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

