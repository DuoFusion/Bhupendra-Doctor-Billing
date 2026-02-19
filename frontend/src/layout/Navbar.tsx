import { Menu, UserCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../routers/RouteConfig";
import { ROUTES } from "../constants/Routes";

interface NavbarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setOpen  }) => {

  const navigate = useNavigate()

    const location = useLocation();

    const currentRoute = routes.find(
      (route) => route.path === location.pathname
    );
  
    const title = currentRoute?.title || "Page";

  return (
    <div className="h-16 bg-gray-900 border-b border-gray-800 text-gray-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 md:ml-64 z-40">

      <button
        className="md:hidden text-gray-200"
        onClick={() => setOpen(true)}
      >
        <Menu size={24} />
      </button>

      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="flex items-center gap-3 cursor-pointer" onClick={()=>navigate(ROUTES.USER.PROFILE)}>
          <UserCircle size={28} className="text-gray-400" />
      </div>

    </div>
  );
};

export default Navbar;
