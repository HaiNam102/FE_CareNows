const FormSelect = ({ label, error, options, ...props }) => {
  const selectClassName = "w-full h-[52px] px-4 border border-[#E6E6E6] rounded-[10px] text-[16px] font-['SVN-Gilroy'] focus:outline-none focus:border-[#60BAA1] appearance-none";

  return (
    <div>
      <label className="block text-[14px] font-['SVN-Gilroy'] text-[#4D4D4D] mb-2">
        {label}
      </label>
      <select className={selectClassName} {...props}>
        <option value="">{props.placeholder || "Chọn..."}</option>
        {options.map((option) => (
          <option key={option.id || option} value={option.name || option}>
            {option.name || option}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default FormSelect; 