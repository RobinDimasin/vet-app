import { useContext, useEffect, useState } from "react";
import FormContext from "../FormContext";

export default function TextAreaField({
  id,
  label,
  placeholder,
  required = true,
  className = "textarea textarea-bordered textarea-sm w-full",
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
          <textarea
            placeholder={placeholder}
            className={[
              className,
              required ? "textarea-primary" : "",
              error ? "textarea-error" : "",
            ].join(" ")}
            {...props}
            {...formik.getFieldProps(id)}
          />
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
