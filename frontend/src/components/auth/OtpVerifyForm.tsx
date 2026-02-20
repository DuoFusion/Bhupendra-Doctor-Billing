import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtpUser } from "../../api/authApi";
import { ROUTES } from "../../constants/Routes";

const OtpVerifyForm = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      alert("Email not found. Please sign in again.");
      navigate(ROUTES.AUTH.SIGNIN);
    }
  }, [navigate]);

  const mutation = useMutation({
    mutationFn: verifyOtpUser,
    onSuccess: (data) => {
      localStorage.removeItem("email");

      // localStorage.setItem("role", data.user.role);

      alert("OTP verified & Signin successful!");

      if (data.user.role === "admin") {
        navigate(ROUTES.ADMIN.DASHBOARD);
      } else if (data.user.role === "user") {
        navigate(ROUTES.USER.DASHBOARD);
      } else {
        navigate("/");
      }
      window.location.reload()
    },
  });

  const handleVerify = () => {
    mutation.mutate({ email, otp });
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
        <h2 className="mb-2 text-center text-2xl font-medium text-slate-100">Verify OTP</h2>
        <p className="mb-6 text-center text-sm text-slate-400">
          Enter the verification code sent to your email
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full rounded-xl border border-[#2a466f]/55 bg-[#0a1a31] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/70 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
          />

          <button
            onClick={handleVerify}
            disabled={mutation.isPending}
            className="w-full rounded-xl bg-[#177db8] py-3 text-sm font-medium text-white transition hover:bg-[#1f8bcb] disabled:opacity-60"
          >
            {mutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>

          {mutation.isError && (
            <p className="text-red-400 text-sm text-center">
              {getErrorMessage()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerifyForm;

