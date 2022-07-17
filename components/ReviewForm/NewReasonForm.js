import Form from "@components/Form/Form";
import TextInputField from "@components/Form/Field/TextInputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useContext, useState } from "react";
import AccountContext from "@components/context/Account/AccountContext";
import { makeApiPostRequest } from "utility";
import TextAreaField from "@components/Form/Field/TextAreaField";

export default function NewReviewForm({
  onSuccess = () => {},
  onError = () => {},
  ...props
}) {
  const [error, setError] = useState();
  const { account } = useContext(AccountContext);

  const createNewReview = useMutation(({ owner_id, rating, comment }) => {
    return makeApiPostRequest("/api/review/new", {
      owner_id,
      rating,
      comment,
    });
  });

  const formik = useFormik({
    initialValues: {
      rating: 5,
      comment: "",
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, "Must be at least 1")
        .max(5, "Must be at most 5")
        .required("Required"),
      comment: Yup.string()
        .max(512, "Must be 512 characters or less")
        .required("Required"),
    }),
    onSubmit: async (values, { setFieldError, resetForm }) => {
      if (account && account.account_type === "owner") {
        const response = await createNewReview.mutateAsync({
          ...values,
          owner_id: account.id,
        });

        if (response.status === 200 && response.data.status === "OK") {
          resetForm();
          onSuccess(response.data.data[0]);
        } else {
          setError(response.data.message);
          onError();
        }
      }
    },
  });

  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-lime-400",
    "bg-green-400",
  ];

  return (
    <Form
      formik={formik}
      title="Create Review"
      error={error}
      className="w-72"
      submitButton={
        <button
          className={`btn btn-primary fluid ${
            createNewReview.isLoading ? "loading" : ""
          }`}
          type="submit"
        >
          Submit Review
        </button>
      }
      {...props}
    >
      <div className="rating gap-1 justify-center">
        {colors.map((color, index) => {
          return (
            <input
              type="radio"
              key={index}
              className={`mask mask-heart ${color}`}
              checked={index === formik.values.rating - 1}
              onClick={() => formik.setFieldValue("rating", index + 1)}
            />
          );
        })}
      </div>
      <TextAreaField id="comment" placeholder="Review" />
    </Form>
  );
}
