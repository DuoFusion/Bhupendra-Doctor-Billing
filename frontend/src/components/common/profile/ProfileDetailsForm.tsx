import React from "react";
import { Lock, Mail, MapPin, PencilLine, Phone, UserRound } from "lucide-react";

interface Props {
  role: string;
}

const ProfileDetailsForm: React.FC<Props> = ({ role }) => {
  const nameLabel = role === "user" ? "Medical Name" : "Full Name";

  const inputClass =
    "w-full rounded-2xl border border-sky-500/40 bg-[#050d1c] px-5 py-4 text-base text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none";

  const fieldLabelClass =
    "mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-100";

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] border border-sky-500/30 bg-gradient-to-b from-[#0d2b4b] to-[#08192f] p-6 shadow-[0_25px_65px_rgba(2,16,38,0.65)] sm:p-10">
      <div className="mb-8 rounded-2xl border border-sky-500/40 bg-[#09203a]/80 px-6 py-6 text-center">
        <h2 className="text-3xl font-semibold text-slate-100">Personal Information</h2>
        <p className="mt-1 text-base text-sky-200/80">
          Your registered details with e-Cyber Crime Portal
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-[44px_1fr] items-end gap-4">
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/45 bg-[#06172b] text-cyan-300">
            <UserRound size={18} />
          </div>
          <div>
            <label className={fieldLabelClass}>{nameLabel}</label>
            <input
              type="text"
              defaultValue={role === "user" ? "ABC Medical Store" : "admin"}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-[44px_1fr] items-end gap-4">
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/45 bg-[#06172b] text-cyan-300">
            <Mail size={18} />
          </div>
          <div>
            <label className={fieldLabelClass}>Email Address</label>
            <input
              type="email"
              defaultValue="www.forstake999@gmail.com"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-[44px_1fr] items-end gap-4">
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/45 bg-[#06172b] text-cyan-300">
            <Phone size={18} />
          </div>
          <div>
            <label className={fieldLabelClass}>Phone Number</label>
            <input
              type="text"
              placeholder="Enter your mobile number"
              defaultValue=""
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-[44px_1fr] items-end gap-4">
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/45 bg-[#06172b] text-cyan-300">
            <Lock size={18} />
          </div>
          <div>
            <label className={fieldLabelClass}>Password</label>
            <input
              type="password"
              value="***************"
              disabled
              className={`${inputClass} cursor-not-allowed opacity-80`}
            />
            <p className="mt-2 text-right text-sm font-medium text-sky-400 hover:underline">
              Change Password ?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[44px_1fr] items-end gap-4">
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/45 bg-[#06172b] text-cyan-300">
            <MapPin size={18} />
          </div>
          <div>
            <label className={fieldLabelClass}>Address</label>
            <input type="text" defaultValue="123 Main Street" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-[44px_1fr] items-end gap-4">
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl border border-sky-500/45 bg-[#06172b] text-cyan-300">
            <PencilLine size={18} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input type="text" defaultValue="Mumbai" placeholder="City" className={inputClass} />
            <input
              type="text"
              defaultValue="Maharashtra"
              placeholder="State"
              className={inputClass}
            />
            <input type="text" defaultValue="400001" placeholder="Pincode" className={inputClass} />
          </div>
        </div>

        <button className="mt-6 w-full rounded-2xl border border-cyan-400/60 bg-gradient-to-r from-[#0f3e6d] via-[#1564ae] to-[#0999c9] py-3 text-base font-semibold tracking-wide text-white shadow-[0_12px_30px_rgba(8,74,146,0.45)] transition hover:brightness-110">
          Update Details
        </button>
      </div>
    </div>
  );
};

export default ProfileDetailsForm;
