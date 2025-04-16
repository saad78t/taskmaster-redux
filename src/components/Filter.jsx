import { useDispatch, useSelector } from "react-redux";
import { setSortBy } from "../redux/tasksSlice";

function Filter() {
  const dispatch = useDispatch();
  const sortBy = useSelector((state) => state.operations.sortBy);

  return (
    <div className="w-full sm:w-48 sm:mr-2">
      <select
        value={sortBy}
        onChange={(e) => dispatch(setSortBy(e.target.value))}
        className="uppercase bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-300"
      >
        <option value="input">sort by input order</option>
        <option value="alphabetic">sort by alphabetical order</option>
        <option value="completed">sort by completed</option>
      </select>
    </div>
  );
}

export default Filter;
