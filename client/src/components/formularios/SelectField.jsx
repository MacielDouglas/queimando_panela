import PropTypes from "prop-types";

export default function SelectField({
  label,
  name,
  value,
  handleChange,
  required,
  options,
}) {
  return (
    <div className="mb-4">
      <label className="block text-black mb-2" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full border ${
          value ? "bg-white" : "bg-stone-100"
        } border-stone-300 rounded-md px-4 py-2 focus:outline-none  focus:border-yellow-500 hover:border-yellow-300 hover:bg-white`}
        required={required}
      >
        <option value="">Selecione uma opção</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};
