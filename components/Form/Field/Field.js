import { createElement, useContext, useEffect, useState } from "react";
import FormContext from "../FormContext";

export default function Field({ id, label, required, as, ...props }) {
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
        <>
          {createElement(as, {
            ...props,
            ...formik.getFieldProps(id),
            className: [
              props.className ?? "",
              error ? `${as}-error` : "",
              required ? `${as}-primary` : "",
            ].join(" "),
          })}
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
        </>
      ) : null}
    </>
  );
}
