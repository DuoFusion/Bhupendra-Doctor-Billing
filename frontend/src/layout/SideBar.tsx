import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  Building2,
  LogIn,
  UserPlus,
  X,
  UserCircle,
  FileText,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { getCurrentUser } from "../api/authApi";
import { ROUTES } from "../constants/Routes";

interface SideBarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar: React.FC<SideBarProps> = ({ open, setOpen }) => {
  const { data } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const role = data?.user?.role || null;

  const adminMenu = [
    { id: 1, text: "Dashboard", path: ROUTES.ADMIN.DASHBOARD, icon: <LayoutDashboard size={18} /> },
    { id: 2, text: "Products", path: ROUTES.PRODUCTS.GET_PRODUCTS, icon: <Package size={18} /> },
    { id: 3, text: "Company", path: ROUTES.COMPANY.GET_COMPANY, icon: <Building2 size={18} /> },
    { id: 4, text: "Bills", path: ROUTES.BILL.GET_BILLS, icon: <FileText size={18} /> },
    { id: 5, text: "Category", path: ROUTES.CATEGORY.GET_CATEGORIES, icon: <FileText size={18} /> },
    { id: 6, text: "Users", path: ROUTES.ADMIN.MANAGE_USERS, icon: <UserPlus size={18} /> },
  ];

  const userMenu = [
    { id: 6, text: "Dashboard", path: ROUTES.USER.DASHBOARD, icon: <LayoutDashboard size={18} /> },
    { id: 7, text: "Products", path: ROUTES.PRODUCTS.GET_PRODUCTS, icon: <Package size={18} /> },
    { id: 8, text: "Company", path: ROUTES.COMPANY.GET_COMPANY, icon: <Building2 size={18} /> },
    { id: 9, text: "Bills", path: ROUTES.BILL.GET_BILLS, icon: <FileText size={18} /> },
    { id: 10, text: "Category", path: ROUTES.CATEGORY.GET_CATEGORIES, icon: <FileText size={18} /> },
  ];

  const guestMenu = [
    { id: 10, text: "Sign In", path: ROUTES.AUTH.SIGNIN, icon: <LogIn size={18} /> },
    { id: 11, text: "Sign Up", path: ROUTES.AUTH.SIGNUP, icon: <UserPlus size={18} /> },
  ];

  const menu = role === "admin" ? adminMenu : role === "user" ? userMenu : guestMenu;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/70 md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col justify-between border-r border-[#1f365a] bg-[#071425]/95 text-slate-100 backdrop-blur-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-5">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-wide text-sky-300">Medico</h2>
            <button
              className="rounded-lg border border-[#2a466f] bg-[#0f2037] p-1.5 text-slate-300 transition hover:border-sky-400/60 hover:text-sky-200 md:hidden"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-2">
            {menu.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-[0_8px_26px_rgba(29,78,216,0.35)]"
                      : "text-slate-300 hover:bg-[#0f2037] hover:text-white"
                  }`
                }
              >
                {item.icon}
                {item.text}
              </NavLink>
            ))}
          </nav>
        </div>

        {role && (
          <div className="border-t border-[#1f365a] p-4">
            <NavLink
              to={ROUTES.USER.PROFILE}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-2 py-2 transition ${
                  isActive ? "bg-[#0f2037]" : "hover:bg-[#0f2037]"
                }`
              }
            >
              <div className="flex items-center gap-3 rounded-lg p-2">
                <UserCircle size={28} className="text-slate-300" />
                <p className="text-sm font-medium uppercase tracking-wide text-slate-200">
                  {data?.user?.name}
                </p>
              </div>
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
};

export default SideBar;
