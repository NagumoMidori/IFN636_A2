const Footer = () => {
  return (
    <footer className="border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Explore Australia. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
