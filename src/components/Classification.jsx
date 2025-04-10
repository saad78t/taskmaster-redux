function Classification({ value, onChange }) {
  const classifications = ["Personal", "Work", "Learning"];

  return (
    <select
      value={value}
      onChange={onChange}
      className="bg-gray-50 border border-gray-300 rounded"
    >
      <option value="">Select Classification</option>
      {classifications.map((clas, i) => (
        <option key={i} value={clas}>
          {clas}
        </option>
      ))}
    </select>
  );
}

export default Classification;
