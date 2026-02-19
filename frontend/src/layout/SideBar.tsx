import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  Building2,
  LogIn,
  UserPlus,
  X,
  UserCircle,
  FileText
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
    { id: 5, text: "Users", path: ROUTES.ADMIN.MANAGE_USERS, icon: <UserPlus size={18} /> }
  ];

  const userMenu = [
    { id: 6, text: "Dashboard", path: ROUTES.USER.DASHBOARD, icon: <LayoutDashboard size={18} /> },
    { id: 7, text: "Products", path: ROUTES.PRODUCTS.GET_PRODUCTS, icon: <Package size={18} /> },
    { id: 8, text: "Company", path: ROUTES.COMPANY.GET_COMPANY, icon: <Building2 size={18} /> },
    { id: 9, text: "Bills", path: ROUTES.BILL.GET_BILLS, icon: <FileText size={18} /> }
  ];

  const guestMenu = [
    { id: 10, text: "Sign In", path: ROUTES.AUTH.SIGNIN, icon: <LogIn size={18} /> },
    { id: 11, text: "Sign Up", path: ROUTES.AUTH.SIGNUP, icon: <UserPlus size={18} /> }
  ];

  const menu =
    role === "admin"
      ? adminMenu
      : role === "user"
      ? userMenu
      : guestMenu;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50
        w-64 h-screen bg-gray-950 text-gray-200
        border-r border-gray-800
        flex flex-col justify-between
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="p-5">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-indigo-500">Medico</h2>
            <button
              className="md:hidden text-gray-400"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {menu.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
          <div className="p-4 border-t border-gray-800">
                      <NavLink
                to={ROUTES.USER.PROFILE}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
            <div className="flex items-center gap-3 p-2 rounded-lg transition cursor-pointer">
              <UserCircle size={28} className="text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {data?.user?.name?.toUpperCase()}
                </p>
              </div>
            </div>
            </NavLink>
          </div>
        )}
      </aside>
    </>
  );
};

export default SideBar;
