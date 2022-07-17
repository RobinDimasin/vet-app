import Form from "@components/Form/Form";
import TextInputField from "@components/Form/Field/TextInputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useContext, useState } from "react";
import AccountContext from "@components/context/Account/AccountContext";
import { makeApiPostRequest } from "utility";

export default function EditReviewForm({
  id,
  values = {
    id: "",
    reason: "",
  },
  onSuccess = () => {},
  onError = () => {},
  ...props
}) {
  const [error, setError] = useState();
  const { account } = useContext(AccountContext);

  const createNewReason = useMutation(({ id, reason }) => {
    return makeApiPostRequest("/api/reason/edit", {
      id,
      reason,
    });
  });

  const formik = useFormik({
    initialValues: values,
    validationSchema: Yup.object({
      reason: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
    }),
    onSubmit: async (values, { setFieldError, resetForm }) => {
      if (account && account.account_type === "admin") {
        const response = await createNewReason.mutateAsync(values);

        if (response.status === 200 && response.data.status === "OK") {
          resetForm();
          onSuccess(response.data.data[0]);
        } else {
          onError();
        }
      }
    },
  });

  return (
    <Form
      formik={formik}
      title={`Edit Reason: ${id}`}
      error={error}
      submitButton={
        <button
          className={`btn btn-primary fluid ${
            createNewReason.isLoading ? "loading" : ""
          }`}
          type="submit"
        >
          Create
        </button>
      }
      {...props}
    >
      <TextInputField id="reason" type="text" placeholder="Reason" />
    </Form>
  );
}
