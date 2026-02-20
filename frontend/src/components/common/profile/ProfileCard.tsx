import { LogOut, Mail, Shield } from "lucide-react";
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

  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="relative mt-8 w-full">
      <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-sky-500/20 via-blue-500/10 to-cyan-400/20 blur-xl"></div>
      <div className="relative overflow-hidden rounded-[2rem] border border-sky-500/35 bg-gradient-to-b from-[#0b2340] to-[#081427] px-7 pb-8 pt-10 shadow-[0_20px_65px_rgba(1,19,46,0.6)]">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-[#13355f]/70 via-[#0f2a4a]/70 to-[#153d70]/70"></div>

        <div className="relative flex flex-col items-center text-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-sky-500/70 bg-[#2f4778] text-5xl font-bold text-white shadow-[0_12px_35px_rgba(12,45,93,0.75)]">
              {isLoading ? "" : initial}
            </div>
          </div>

          <h2 className="mt-7 inline-block bg-blue-600/80 px-4 py-1 text-3xl font-semibold leading-none text-white">
            {isLoading ? "Loading..." : name}
          </h2>

          <div className="mt-3 flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1 text-xs font-medium uppercase tracking-wider text-cyan-200">
            <Shield size={13} />
            {isLoading ? "" : role}
          </div>

          <div className="mt-7 flex items-center gap-2 rounded-lg border border-[#1f4b7c] bg-[#091a32]/90 px-3 py-2 text-sm text-slate-200">
            <Mail size={14} className="text-cyan-300" />
            <span className="break-all">{isLoading ? "" : email}</span>
          </div>

          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-slate-600/70 bg-[#0f2441]/70 px-6 py-3 text-base font-medium text-slate-100 transition-all duration-300 hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={16} />
            {isPending ? "Signing out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
