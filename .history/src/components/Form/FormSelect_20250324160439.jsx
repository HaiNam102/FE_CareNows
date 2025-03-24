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
        {options.map((option, index) => (
          <option 
            key={index} 
            value={typeof option === 'object' ? option.value : option}
          >
            {typeof option === 'object' ? option.label : option === 'MALE' ? 'Nam' : 'Nữ'}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormSelect; 