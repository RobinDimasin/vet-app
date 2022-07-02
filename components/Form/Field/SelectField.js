import { useContext, useEffect, useState } from "react";
import FormContext from "../FormContext";

export default function SelectField({
  id,
  label,
  placeholder,
  required = true,
  className = "select select-bordered select-sm w-full",
  options = [],
  ...props
}) {
  const [error, setError] = useState();
  const { formik } = useContext(FormContext);

  useEffect(() => {
    if (formik) {
      setError(formik.touched[id] && formik.errors[id]);
    }
  }, [formik, id]);

  return (
    <>
      {formik ? (
        <div>
          <select
            placeholder={placeholder}
            className={[
              className,
              required ? "select-primary" : "",
              error ? "select-error" : "",
            ].join(" ")}
            {...props}
            {...formik.getFieldProps(id)}
          >
            <option value="" disabled selected hidden>
              {placeholder}
            </option>
            {options.map((option) => {
              return (
                <option key={option.id} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
          {error || label ? (
            <>
              <label className="label py-0 space-y-0">
                <span className="label-text text-xs text-error">
                  {formik.errors[id]}
                </span>
                {label}
              </label>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
