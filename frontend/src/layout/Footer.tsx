const Footer = () => {
  return (
    <footer className="border-t border-[#1f365a] bg-[#081426]/90 px-6 py-4 text-slate-400 backdrop-blur-xl">
      <div className="flex flex-col items-center justify-between gap-2 text-sm md:flex-row">
        <p>© {new Date().getFullYear()} Medico. All rights reserved.</p>

        <div className="flex gap-5">
          <span className="cursor-pointer transition hover:text-sky-200">Privacy</span>
          <span className="cursor-pointer transition hover:text-sky-200">Terms</span>
          <span className="cursor-pointer transition hover:text-sky-200">Support</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
