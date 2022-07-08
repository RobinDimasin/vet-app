import Form from "@components/Form/Form";
import TextInputField from "@components/Form/Field/TextInputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import SelectField from "@components/Form/Field/SelectField";
import DateField from "@components/Form/Field/DateField";
import TextAreaField from "@components/Form/Field/TextAreaField";

export default function AppointmentForm({
  pets = [],
  reasons = [],
  values = {
    pet_id: "",
    reason: "",
    description: "",
    date: "",
  },
}) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: values,
    validationSchema: Yup.object({
      pet_id: Yup.string().required("Required"),
      reason: Yup.string().required("Required"),
      date: Yup.date(),
      description: Yup.string()
        .max(512, "Must be 512 characters or less")
        .required("Required"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Form
      formik={formik}
      title="Appointment"
      error={error}
      submitButton={
        <button
          className={`btn btn-primary fluid ${loading ? "loading" : ""}`}
          type="submit"
        >
          Submit
        </button>
      }
    >
      <SelectField
        id="pet_id"
        placeholder="Pet"
        options={pets.map((pet) => {
          return {
            id: pet.id,
            value: pet.id,
            label: pet.name,
          };
        })}
      />
      <DateField id="date" placeholder="Appointment Date" />
      <SelectField
        id="reason"
        placeholder="Reason"
        options={reasons.map((reason) => {
          return {
            id: reason.id,
            value: reason.id,
            label: reason.reason,
          };
        })}
      />
      <TextAreaField id="description" placeholder="Reason Description" />
    </Form>
  );
}
