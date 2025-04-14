function Classification({ value, onChange, className = "" }) {
  const classifications = ["Personal", "Work", "Learning"];

  return (
    <select value={value} onChange={onChange} className={className}>
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
