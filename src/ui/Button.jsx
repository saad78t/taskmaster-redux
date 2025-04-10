function Button({ type = "default", children, onClick }) {
  switch (type) {
    case "submit":
      return (
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
        >
          {children}
        </button>
      );
    case "delete":
      return (
        <button
          onClick={onClick}
          className="text-red-500 hover:text-red-700 transition duration-200"
        >
          {children}
        </button>
      );
    case "danger":
      return (
        <button
          onClick={onClick}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded shadow-md transition"
        >
          {children}
        </button>
      );
    default:
      return (
        <button
          onClick={onClick}
          className="bg-gray-300 text-black px-3 py-1 rounded"
        >
          {children}
        </button>
      );
  }
}

export default Button;
