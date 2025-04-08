function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 text-center mt-10 shadow-inner sticky bottom-0 w-full">
      <p className="text-sm">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-white">TaskMaster Redux</span>. All
        rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
