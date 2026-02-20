import { LogOut, Mail, Phone, Shield, User } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getCurrentUser, signout } from "../../../api/authApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../constants/Routes";

const ProfileCard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signout,
    onSuccess: () => {
      queryClient.cancelQueries({ queryKey: ["currentUser"] });

      queryClient.setQueryData(["currentUser"], null);

      queryClient.setQueryData(["bills"], { bills: [] });
      queryClient.setQueryData(["products"], { products: [] });
      queryClient.setQueryData(["companies"], { companies: [] });
      queryClient.setQueryData(["users"], { users: [] });

      try {
        window.alert("Signed out successfully");
      } catch (e) {}
      setTimeout(() => navigate(ROUTES.AUTH.SIGNIN), 1000);
    },
    onError: (err: unknown) => {
      let msg = "Sign out failed";
      if ((err as AxiosError)?.isAxiosError) {
        const axiosErr = err as AxiosError;
        msg = (axiosErr.response?.data as any)?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }

      try {
        window.alert(msg);
      } catch (e) {}
    },
  });

  const user = data?.user;
  const name = user?.name || "";
  const email = user?.email || "";
  const role = user?.role || "";
  const phone = user?.phone || "";


  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-[#244066] bg-gradient-to-b from-[#10243f] to-[#081628]">
        <div className="h-20 bg-gradient-to-r from-[#14335a] via-[#10294a] to-[#174171]" />

        <div className="-mt-10 px-6 pb-7">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-sky-400/60 bg-[#2f4778] text-3xl font-bold text-white">
            {isLoading ? "" : initial}
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-2xl font-semibold tracking-wide text-white">
              {isLoading ? "Loading..." : name}
            </h2>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-200">
              <Shield size={12} />
              {isLoading ? "" : role}
            </div>
          </div>

          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#36557f] bg-[#10243f] px-5 py-2.5 text-sm font-medium text-slate-100 transition hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={15} />
            {isPending ? "Signing out..." : "Log Out"}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#244066] bg-[#0b172a]/90">
        <div className="border-b border-[#213a60] px-5 py-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
            User Information
          </h3>
        </div>

        <div className="divide-y divide-[#1f3557]">
          <div className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
            <span className="inline-flex items-center gap-2 text-slate-400">
              <User size={14} /> Name
            </span>
            <span className="text-slate-100">{isLoading ? "" : name || "-"}</span>
          </div>

          <div className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
            <span className="inline-flex items-center gap-2 text-slate-400">
              <Mail size={14} /> Email
            </span>
            <span className="max-w-[65%] break-all text-right text-slate-100">{isLoading ? "" : email || "-"}</span>
          </div>

          <div className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
            <span className="inline-flex items-center gap-2 text-slate-400">
              <Phone size={14} /> Phone
            </span>
            <span className="text-slate-100">{phone ? phone : "Not Verified"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
