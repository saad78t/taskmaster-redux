function Header() {
  return (
    <header className="bg-blue-600 text-white py-4 px-6 shadow-lg rounded-md">
      <h1 className="text-3xl font-bold flex items-center justify-center">
        <img src="/taskmaster.png" width="50" height="50" className="mr-2" />
        TaskMaster Redux + Supabase Version
      </h1>
    </header>
  );
}

export default Header;
