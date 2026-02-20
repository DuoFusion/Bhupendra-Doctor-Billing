import { Menu, UserCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../routers/RouteConfig";
import { ROUTES } from "../constants/Routes";

interface NavbarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentRoute = routes.find((route) => route.path === location.pathname);
  const title = currentRoute?.title || "Page";

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

          <h1 className="text-base font-semibold tracking-wide text-slate-100 sm:text-lg">
            {title}
          </h1>
        </div>

        <button
          className="flex items-center gap-2 rounded-full border border-[#2a466f] bg-[#0d1c33] px-2 py-1 text-slate-300 transition hover:border-sky-400/60 hover:text-sky-200"
          onClick={() => navigate(ROUTES.USER.PROFILE)}
        >
          <UserCircle size={26} className="text-slate-300" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
