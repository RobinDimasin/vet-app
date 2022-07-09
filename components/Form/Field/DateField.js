import TextInputField from "./TextInputField";

export default function DateField(props) {
  return (
    <TextInputField
      {...props}
      type="text"
      onFocus={(e) => {
        e.target.type = "date";
      }}
      onBlur={(e) => {
        if (!e.target.value) {
          e.target.type = "text";
        }
      }}
    />
  );
}
