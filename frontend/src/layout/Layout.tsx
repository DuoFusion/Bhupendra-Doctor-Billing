import { useState } from "react";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import AllRoute from "../routers/AllRoute";
import Footer from "./Footer";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex bg-gray-950 text-white overflow-hidden">
      
      <SideBar open={open} setOpen={setOpen} />

      <div className="flex-1 md:ml-64 flex flex-col  overflow-hidden">

        <Navbar setOpen={setOpen} />

        <main className="flex-1 pt-16 p-6 overflow-auto">
          <AllRoute />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
