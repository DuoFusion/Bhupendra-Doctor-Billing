
const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 py-4 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between text-sm">

        <p>
          © {new Date().getFullYear()} Medico. All rights reserved.
        </p>

        <div className="flex gap-4 mt-2 md:mt-0">
          <span className="hover:text-white cursor-pointer transition">
            Privacy
          </span>
          <span className="hover:text-white cursor-pointer transition">
            Terms
          </span>
          <span className="hover:text-white cursor-pointer transition">
            Support
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
