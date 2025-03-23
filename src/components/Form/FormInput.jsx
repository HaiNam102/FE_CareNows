const getInputClassName = (name, value, error) => {
  const baseStyle = "w-full h-[52px] px-4 border rounded-[10px] text-[16px] font-['SVN-Gilroy'] focus:outline-none";
  
  if (!value) {
    return `${baseStyle} border-[#E6E6E6]`;
  }
  
  if (error) {
    return `${baseStyle} border-red-500 !bg-red-50`;
  }

  return `${baseStyle} border-[#60BAA1] !bg-[#E7FFF9]`;
};

const FormInput = ({ label, error, ...props }) => {
  return (
    <div>
      <label className="block text-[14px] font-['SVN-Gilroy'] text-[#4D4D4D] mb-2">
        {label}
      </label>
      <input
        className={getInputClassName(props.name, props.value, error)}
        {...props}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default FormInput; 