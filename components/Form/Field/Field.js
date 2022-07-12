import { createElement, useContext, useEffect, useState } from "react";
import { getValueFromObject } from "utility";
import FormContext from "../FormContext";

export default function Field({
  id,
  label,
  required,
  valueMap = (v) => v,
  as,
  placeholder,
  ...props
}) {
  const [error, setError] = useState();
  const { formik } = useContext(FormContext);

  useEffect(() => {
    if (formik) {
      if (getValueFromObject(formik.touched, id)) {
        setError(getValueFromObject(formik.errors, id));
      }
    }
  }, [formik, id]);

  return (
    <>
      {formik ? (
        <div className="my_input mt-2">
          {createElement(as, {
            placeholder,
            ...props,
            ...formik.getFieldProps(id),
            onBlur: (...args) => {
              if (props.onBlur) {
                props.onBlur(...args);
              }

              return formik.getFieldProps(id).onBlur(...args);
            },
            className: [
              props.className ?? "",
              error ? `${as}-error` : "",
              required ? `${as}-primary` : "",
              "my_input__field",
            ].join(" "),
          })}
          <div className="my_input__label">{placeholder}</div>
          {error || label ? (
            <>
              <label className="label py-0 space-y-0">
                <span className="label-text text-xs text-error">{error}</span>
                {label}
              </label>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
