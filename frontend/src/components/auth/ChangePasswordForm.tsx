import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { changeUserPassword } from "../../api/authApi";
import { ROUTES } from "../../constants/Routes";

const ChangePasswordForm = () => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const mutation = useMutation({
    mutationFn: changeUserPassword,
    onSuccess: (data) => {
      setErrorMessage("");
      setSuccessMessage(data?.message || "Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate(ROUTES.USER.PROFILE);
      }, 1200);
    },
    onError: (error: unknown) => {
      let message = "Failed to change password";
      if ((error as AxiosError)?.isAxiosError) {
        const axiosError = error as AxiosError;
        message = (axiosError.response?.data as any)?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      setSuccessMessage("");
      setErrorMessage(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (newPassword.length < 5) {
      setErrorMessage("New password must be at least 5 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirm password must match");
      return;
    }

    mutation.mutate({ oldPassword, newPassword, confirmPassword });
  };

  const inputClass =
    "w-full rounded-xl border border-[#2a466f] bg-[#0a1a31] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30";

  return (
    <div className="min-h-[70vh] px-4 py-8">
      <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-[#244066] bg-[#0b172a]/90 p-6">
        <h2 className="text-center text-2xl font-semibold text-slate-100">Change Password</h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          Update your account password securely
        </p>

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

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={inputClass}
              placeholder="Enter old password"
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="Re-enter new password"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(ROUTES.USER.PROFILE)}
              className="w-full rounded-xl border border-[#36557f] bg-[#10243f] py-3 text-sm font-medium text-slate-200 transition hover:border-sky-400/60 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-xl border border-sky-400/40 bg-gradient-to-r from-[#1f5ea8] to-[#0f81b3] py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
