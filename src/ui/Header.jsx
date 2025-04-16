function Header() {
  return (
    <header className="bg-blue-600 dark:bg-gray-900 text-white dark:text-yellow-200 py-4 px-6 shadow-lg rounded-md transition-all duration-300">
      <h1 className="text-3xl font-bold flex items-center justify-center">
        <img
          src="/taskmaster.png"
          width="50"
          height="50"
          className="mr-2"
          alt="TaskMaster Logo"
        />
        TaskMaster Redux + Supabase Version
      </h1>
    </header>
  );
}

export default Header;
