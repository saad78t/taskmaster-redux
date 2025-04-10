function SelectPriority({ value, onChange }) {
  const priorities = ["High", "Medium", "Low"];

  return (
    <select
      value={value}
      onChange={onChange}
      className="bg-gray-50 border border-gray-300 rounded"
    >
      <option value="">Select Priority</option>
      {priorities.map((priority, i) => (
        <option key={i} value={priority}>
          {priority}
        </option>
      ))}
    </select>
  );
}

export default SelectPriority;
