import { useEffect } from "react";
import FormContext from "./FormContext";

export default function FormProvider({ formik, error, children }) {
  return (
    <FormContext.Provider value={{ formik, error }}>
      {children}
    </FormContext.Provider>
  );
}
