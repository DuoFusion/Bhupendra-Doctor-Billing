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
      <div className="w-full max-w-md bg-[#0b172a]/95 border border-[#1e3354] rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Verify OTP</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f2037] rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
          />

          <button
            onClick={handleVerify}
            disabled={mutation.isPending}
            className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 py-3 rounded-md font-medium transition"
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

