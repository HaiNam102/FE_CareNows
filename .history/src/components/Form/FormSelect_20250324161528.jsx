const FormSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  placeholder, 
  error, 
  disabled 
}) => {
  const renderOption = (option) => {
    // Nếu option là object (cho gender)
    if (typeof option === 'object' && option.value) {
      return (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      );
    }
    
    // Nếu option là string (cho quận/phường)
    return (
      <option key={option} value={option}>
        {option}
      </option>
    );
  };

  return (
    <div>
      <label className="block text-[14px] font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full h-[52px] px-4 border rounded-[10px] text-[16px] font-['SVN-Gilroy'] focus:outline-none ${
          disabled ? 'bg-gray-100' : ''
        }`}
      >
        <option value="">{placeholder}</option>
        {Array.isArray(options) && options.map(renderOption)}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormSelect; 