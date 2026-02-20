import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  resetForgotPassword,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
} from "../../api/authApi";
import { ROUTES } from "../../constants/Routes";

const ResetForgetPasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const inputClass =
    "w-full rounded-xl border border-[#2a466f]/55 bg-[#0a1a31] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/70 focus:outline-none focus:ring-2 focus:ring-sky-500/20";

  const getApiErrorMessage = (error: unknown, fallback: string) => {
    if ((error as AxiosError)?.isAxiosError) {
      const axiosError = error as AxiosError;
      return (axiosError.response?.data as any)?.message || fallback;
    }
    if (error instanceof Error) return error.message;
    return fallback;
  };

  const sendOtpMutation = useMutation({
    mutationFn: sendForgotPasswordOtp,
    onSuccess: (data) => {
      setErrorMessage("");
      setSuccessMessage(data?.message || "OTP sent successfully");
      setStep(2);
    },
    onError: (error) => {
      setSuccessMessage("");
      setErrorMessage(getApiErrorMessage(error, "Failed to send OTP"));
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyForgotPasswordOtp,
    onSuccess: (data) => {
      setErrorMessage("");
      setSuccessMessage(data?.message || "OTP verified successfully");
      setStep(3);
    },
    onError: (error) => {
      setSuccessMessage("");
      setErrorMessage(getApiErrorMessage(error, "Failed to verify OTP"));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetForgotPassword,
    onSuccess: (data) => {
      setErrorMessage("");
      setSuccessMessage(data?.message || "Password reset successfully");
      setStep(4);
      setTimeout(() => navigate(ROUTES.AUTH.SIGNIN), 1500);
    },
    onError: (error) => {
      setSuccessMessage("");
      setErrorMessage(getApiErrorMessage(error, "Failed to reset password"));
    },
  });

  const isSubmitting = useMemo(
    () =>
      sendOtpMutation.isPending ||
      verifyOtpMutation.isPending ||
      resetPasswordMutation.isPending,
    [sendOtpMutation.isPending, verifyOtpMutation.isPending, resetPasswordMutation.isPending]
  );

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Email is required");
      return;
    }

    sendOtpMutation.mutate({ email: email.trim() });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!otp.trim()) {
      setErrorMessage("OTP is required");
      return;
    }

    if (otp.trim().length !== 6) {
      setErrorMessage("OTP must be 6 digits");
      return;
    }

    verifyOtpMutation.mutate({ email: email.trim(), otp: otp.trim() });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!newPassword || !confirmPassword) {
      setErrorMessage("New password and confirm password are required");
      return;
    }

    if (newPassword.length < 5) {
      setErrorMessage("Password must be at least 5 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password must match");
      return;
    }

    resetPasswordMutation.mutate({
      email: email.trim(),
      otp: otp.trim(),
      newPassword,
      confirmPassword,
    });
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-[#0b172a]/90 p-7 ring-1 ring-white/5">
        <h2 className="text-center text-2xl font-medium text-slate-100">Forgot Password</h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          {step === 1 && "Enter your email to receive OTP"}
          {step === 2 && "Enter OTP sent to your email"}
          {step === 3 && "Set your new password"}
          {step === 4 && "Password reset completed"}
        </p>

        <div className="mt-4 text-center text-xs text-slate-500">Step {step} of 4</div>

        {errorMessage && (
          <div className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mt-5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {successMessage}
          </div>
        )}

        {step === 1 && (
          <form className="mt-6 space-y-4" onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#177db8] py-3 text-sm font-medium text-white transition hover:bg-[#1f8bcb] disabled:opacity-60"
            >
              {sendOtpMutation.isPending ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="mt-6 space-y-4" onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={inputClass}
              maxLength={6}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full rounded-xl bg-[#10243f] py-3 text-sm font-medium text-slate-200 transition hover:bg-[#153252]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#177db8] py-3 text-sm font-medium text-white transition hover:bg-[#1f8bcb] disabled:opacity-60"
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form className="mt-6 space-y-4" onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full rounded-xl bg-[#10243f] py-3 text-sm font-medium text-slate-200 transition hover:bg-[#153252]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#177db8] py-3 text-sm font-medium text-white transition hover:bg-[#1f8bcb] disabled:opacity-60"
              >
                {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="mt-6 space-y-4 text-center">
            <p className="text-sm text-slate-300">Your password has been reset successfully.</p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.AUTH.SIGNIN)}
              className="w-full rounded-xl bg-[#177db8] py-3 text-sm font-medium text-white transition hover:bg-[#1f8bcb]"
            >
              Go to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetForgetPasswordForm;
