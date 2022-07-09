import Field from "./Field";

export default function TextAreaField({
  id,
  label,
  placeholder,
  required = true,
  className = "textarea textarea-bordered textarea-sm w-full",
  ...props
}) {
  return (
    <Field
      id={id}
      as="textarea"
      className={className}
      label={label}
      placeholder={placeholder}
      required
      {...props}
      rows={1}
    />
  );
}
