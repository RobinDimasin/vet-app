import Field from "./Field";

export default function SelectField({
  id,
  label,
  placeholder,
  required = true,
  className = "select select-bordered select-sm w-full",
  options = [],
  ...props
}) {
  return (
    <Field
      id={id}
      as="select"
      className={className}
      label={label}
      placeholder={placeholder}
      required
      {...props}
    >
      <option value="" disabled selected hidden>
        {/* {placeholder} */}
      </option>
      {options.map((option) => {
        return (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        );
      })}
    </Field>
    // <>
    //   {formik ? (
    //     <div>
    //       <select
    //         placeholder={placeholder}
    //         className={[
    //           className,
    //           required ? "select-primary" : "",
    //           error ? "select-error" : "",
    //         ].join(" ")}
    //         {...props}
    //         {...formik.getFieldProps(id)}
    //       >
    //         <option value="" disabled selected hidden>
    //           {placeholder}
    //         </option>
    //         {options.map((option) => {
    //           return (
    //             <option key={option.id} value={option.value}>
    //               {option.label}
    //             </option>
    //           );
    //         })}
    //       </select>
    //       {error || label ? (
    //         <>
    //           <label className="label py-0 space-y-0">
    //             <span className="label-text text-xs text-error">
    //               {formik.errors[id]}
    //             </span>
    //             {label}
    //           </label>
    //         </>
    //       ) : null}
    //     </div>
    //   ) : null}
    // </>
  );
}
