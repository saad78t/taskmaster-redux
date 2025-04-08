function Button({ type, children }) {
  if (type === "submit")
    return (
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0.3 px-1 rounded">
        {children}
      </button>
    );

  if (type === "delete")
    return (
      <button className=" text-red-500 hover:text-red-700 transition duration-200">
        {children}
      </button>
    );
}

export default Button;
