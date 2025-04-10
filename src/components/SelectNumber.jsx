function SelectNumber({ value, onChange }) {
  return (
    <select
      className="bg-gray-50 border border-gray-300 rounded"
      value={value}
      onChange={onChange}
    >
      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
        <option value={num} key={num}>
          {num}
        </option>
      ))}
    </select>
  );
}

export default SelectNumber;
