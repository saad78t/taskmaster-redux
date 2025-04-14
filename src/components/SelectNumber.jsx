function SelectNumber({ value, onChange, className = "" }) {
  return (
    <select value={value} onChange={onChange} className={className}>
      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
        <option value={num} key={num}>
          {num}
        </option>
      ))}
    </select>
  );
}

export default SelectNumber;
