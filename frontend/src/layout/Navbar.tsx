import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChevronDown, LogOut, Menu, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, signout } from "../api/authApi";
import { routes } from "../routers/RouteConfig";
import { ROUTES } from "../constants/Routes";

interface NavbarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const currentRoute = routes.find((route) => route.path === location.pathname);
  const title = currentRoute?.title || "Page";

  const { data } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const { mutate: signoutUser, isPending } = useMutation({
    mutationFn: signout,
    onSuccess: () => {
      queryClient.cancelQueries({ queryKey: ["currentUser"] });
      queryClient.setQueryData(["currentUser"], null);
      queryClient.setQueryData(["bills"], { bills: [] });
      queryClient.setQueryData(["products"], { products: [] });
      queryClient.setQueryData(["companies"], { companies: [] });
      queryClient.setQueryData(["users"], { users: [] });
      navigate(ROUTES.AUTH.SIGNIN);
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

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  const userName = data?.user?.name || "Profile";
  const initial = userName?.charAt(0)?.toUpperCase() || "U";
  const isAuthenticated = Boolean(data?.user?._id || data?.user?.email);

  useEffect(() => {
    if (!isAuthenticated && showMenu) {
      setShowMenu(false);
    }
  }, [isAuthenticated, showMenu]);

  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#1f365a] bg-[#081426]/90 backdrop-blur-xl md:left-64">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl border border-[#2a466f] bg-[#0f2037] p-2 text-slate-100 transition hover:border-sky-400/60 hover:text-sky-200 md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>

          <h1 className="text-base font-medium tracking-wide text-slate-100 sm:text-lg">
            {title}
          </h1>
        </div>

        {isAuthenticated && (
          <div className="relative" ref={menuRef}>
            <button
              className="flex items-center gap-2 rounded-xl bg-[#0d1c33] px-2.5 py-1.5 text-slate-200 transition hover:text-sky-200"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#142943] text-sm text-slate-100">
                {data?.user ? initial : <UserCircle size={17} />}
              </span>
              <span className="hidden max-w-[120px] truncate text-sm md:block">{userName}</span>
              <ChevronDown size={16} className={`transition ${showMenu ? "rotate-180" : ""}`} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl bg-[#0c1b31] p-1.5 ring-1 ring-white/10">
                <button
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-[#142b46]"
                  onClick={() => {
                    setShowMenu(false);
                    navigate(ROUTES.USER.PROFILE);
                  }}
                >
                  Profile
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-[#142b46] hover:text-red-200"
                  onClick={() => {
                    setShowMenu(false);
                    signoutUser();
                  }}
                  disabled={isPending}
                >
                  <LogOut size={15} />
                  {isPending ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
