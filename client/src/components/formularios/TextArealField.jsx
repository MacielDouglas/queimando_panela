import PropTypes from "prop-types";

export default function TextAreaField({
  label,
  name,
  value,
  handleChange,
  required,
}) {
  return (
    <div className="mb-4">
      <label className="block text-black mb-2" htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full border ${
          value ? "bg-white" : "bg-stone-100"
        } border-stone-300 rounded-md px-4 py-2 focus:outline-none  focus:border-yellow-500 hover:border-yellow-300 hover:bg-white`}
        required={required}
      />
    </div>
  );
}

TextAreaField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};
