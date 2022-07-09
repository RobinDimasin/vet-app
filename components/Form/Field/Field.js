import { createElement, useContext, useEffect, useState } from "react";
import { getValueFromObject } from "utility";
import FormContext from "../FormContext";

export default function Field({ id, label, required, as, ...props }) {
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
        <>
          {createElement(as, {
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
            ].join(" "),
          })}
          {error || label ? (
            <>
              <label className="label py-0 space-y-0">
                <span className="label-text text-xs text-error">{error}</span>
                {label}
              </label>
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
}
