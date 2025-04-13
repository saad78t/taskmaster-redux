import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../redux/tasksSlice";
import { Search as SearchIcon } from "lucide-react";

function Search() {
  const search = useSelector((state) => state.operations.search);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2 w-full sm:w-72 sm:mr-2">
      <SearchIcon className="text-gray-400" size={18} />
      <input
        type="text"
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        placeholder="Search tasks..."
        className="w-full focus:outline-none text-sm placeholder-gray-400"
      />
    </div>
  );
}

export default Search;
