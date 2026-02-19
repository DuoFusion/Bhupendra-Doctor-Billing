import { LogOut, Mail, Shield } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { getCurrentUser, signout } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/Routes";

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
    <div className="mt-8 flex items-center justify-center p-6">
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-20"></div>

        <div className="relative bg-[#111c2e]/80 backdrop-blur-xl border border-[#1e2d4a] rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {isLoading ? "" : initial}
              </div>
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111c2e]"></div>
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-white tracking-wide">
              {isLoading ? "Loading..." : name}
            </h2>

            <div className="mt-3 flex items-center gap-2 px-4 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Shield size={14} />
              {isLoading ? "" : role}
            </div>
          </div>

          <div className="my-6 border-t border-[#1e2d4a]"></div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-[#0e1a2b] border border-[#1e2d4a] rounded-xl p-3">
              <Mail size={16} className="text-cyan-400" />
              <span className="text-sm text-gray-300">{isLoading ? "" : email}</span>
            </div>
          </div>

          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="mt-8 w-full py-3 rounded-xl border border-red-500/40 text-red-400 font-medium flex items-center justify-center gap-2 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300 transition-all duration-300 disabled:opacity-60"
          >
            <LogOut size={16} />
            {isPending ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
