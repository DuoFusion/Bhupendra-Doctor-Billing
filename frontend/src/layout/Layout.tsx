import { useState } from "react";
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import AllRoute from "../routers/AllRoute";
import Footer from "./Footer";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#030712] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_-20%,rgba(56,189,248,0.18),transparent_36%),radial-gradient(circle_at_120%_0%,rgba(37,99,235,0.14),transparent_34%)]" />

      <SideBar open={open} setOpen={setOpen} />

      <div className="relative z-10 ml-0 flex min-h-screen flex-1 flex-col overflow-hidden md:ml-64">
        <Navbar setOpen={setOpen} />

        <main className="flex-1 overflow-auto px-4 pb-8 pt-20 sm:px-6 lg:px-8">
          <AllRoute />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
