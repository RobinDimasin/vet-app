import Field from "./Field";

export default function TextInputField({
  id,
  type = "text",
  label,
  placeholder,
  required = true,
  className = "input input-bordered input-sm w-full",
  ...props
}) {
  return (
    <Field
      id={id}
      as="input"
      className={className}
      label={label}
      placeholder={placeholder}
      required
      type={type}
      {...props}
    />
  );
}
