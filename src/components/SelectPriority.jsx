function SelectPriority({ value, onChange, className = "" }) {
  const priorities = ["High", "Medium", "Low"];

  return (
    <select value={value} onChange={onChange} className={className}>
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
