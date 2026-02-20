import React, { useState, useEffect } from "react";
import { Lock, Mail, MapPin, PencilLine, Phone, UserRound } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCurrentUser, updateUserProfile } from "../../../api/authApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/Routes";

interface Props {
  role: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  role: string;
}

const ProfileDetailsForm: React.FC<Props> = ({ role }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<UserData>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: userData, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    if (userData?.user) {
      setFormData({
        name: userData.user.name || "",
        email: userData.user.email || "",
        phone: userData.user.phone || "",
        address: userData.user.address || "",
        city: userData.user.city || "",
        state: userData.user.state || "",
        pincode: userData.user.pincode || "",
      });
    }
  }, [userData]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      setSuccessMessage("Profile updated successfully!");
      setErrorMessage("");
      if (data.user) {
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          city: data.user.city || "",
          state: data.user.state || "",
          pincode: data.user.pincode || "",
        });
      }
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Failed to update profile");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
      setSuccessMessage("");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateDetails = () => {
    const updatePayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    };

    mutation.mutate(updatePayload);
  };

  const inputClass =
    "w-full rounded-xl border border-[#2a466f]/55 bg-[#0a1a31] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400/70 focus:outline-none focus:ring-2 focus:ring-sky-500/20";

  const fieldLabelClass =
    "mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-slate-300";

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden rounded-3xl bg-[#0b172a]/90 p-4 ring-1 ring-white/5 sm:p-7">
        <div className="text-center text-slate-300">Loading profile...</div>
      </div>
    );
  }


  return (
    <div className="w-full overflow-hidden rounded-3xl bg-[#0b172a]/90 p-4 ring-1 ring-white/5 sm:p-7">
      <div className="mb-6 rounded-2xl bg-[#0d1d34]/70 px-5 py-5 text-center">
        <h2 className="text-2xl font-medium text-slate-100 sm:text-3xl">Personal Information</h2>
        <p className="mt-1 text-sm text-slate-400">Your registered details with e-Cyber Crime Portal</p>
      </div>

      {successMessage && (
        <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300 text-sm">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-[40px_1fr] items-end gap-3">
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a1a31] text-sky-300">
            <UserRound size={16} />
          </div>
          <div>
            <label className={fieldLabelClass}>{role === "admin" ? "Full Name" : "Medical Name"}</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-[40px_1fr] items-end gap-3">
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a1a31] text-sky-300">
            <Mail size={16} />
          </div>
          <div>
            <label className={fieldLabelClass}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-[40px_1fr] items-end gap-3">
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a1a31] text-sky-300">
            <Phone size={16} />
          </div>
          <div>
            <label className={fieldLabelClass}>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your mobile number"
              value={formData.phone || ""}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-[40px_1fr] items-end gap-3">
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a1a31] text-sky-300">
            <Lock size={16} />
          </div>
          <div>
            <label className={fieldLabelClass}>Password</label>
            <input
              type="password"
              value="***************"
              disabled
              className={`${inputClass} cursor-not-allowed opacity-80`}
            />
            <p
              className="mt-2 cursor-pointer text-right text-sm font-medium text-sky-300 hover:underline"
              onClick={() => navigate(ROUTES.AUTH.CHANGE_PASSWORD)}
            >
              Change Password ?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[40px_1fr] items-end gap-3">
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a1a31] text-sky-300">
            <MapPin size={16} />
          </div>
          <div>
            <label className={fieldLabelClass}>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-[40px_1fr] items-end gap-3">
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0a1a31] text-sky-300">
            <PencilLine size={16} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city || ""}
              onChange={handleInputChange}
              className={inputClass}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state || ""}
              onChange={handleInputChange}
              className={inputClass}
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode || ""}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>
        </div>

        <button
          onClick={handleUpdateDetails}
          disabled={mutation.isPending}
          className="mt-4 w-full rounded-xl bg-[#177db8] py-3 text-sm font-medium tracking-wide text-white transition hover:bg-[#1f8bcb] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isPending ? "Updating..." : "Update Details"}
        </button>
      </div>
    </div>
  );
};

export default ProfileDetailsForm;
