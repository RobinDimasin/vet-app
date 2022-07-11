import Form from "@components/Form/Form";
import TextInputField from "@components/Form/Field/TextInputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { useContext, useState } from "react";
import AccountContext from "@components/context/Account/AccountContext";
import { makeApiPostRequest } from "utility";
import SelectField from "@components/Form/Field/SelectField";
import TextAreaField from "@components/Form/Field/TextAreaField";
import DateField from "@components/Form/Field/DateField";
import moment from "moment";

export default function EditPetForm({
  id,
  values = {
    name: "",
    sex: "",
    breed: "",
    birthdate: "",
    species: "",
    description: "",
  },
  onSuccess = () => {},
  onError = () => {},
  ...props
}) {
  const [error, setError] = useState();
  const { account } = useContext(AccountContext);

  const editPetProfile = useMutation(
    async ({ owner_id, name, sex, breed, birthdate, species, description }) => {
      return await makeApiPostRequest("/api/pet/edit", {
        id,
        owner_id,
        name,
        sex,
        breed,
        birthdate,
        species,
        description,
      });
    }
  );

  const formik = useFormik({
    initialValues: {
      ...values,
      birthdate: moment(values.birthdate).format("YYYY-MM-DD"),
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
      sex: Yup.string().oneOf(["M", "F"], "M or F only").required("Required"),
      birthdate: Yup.date()
        .max(
          moment().format("YYYY-MM-DD"),
          "Birthdate cannot be from the future"
        )
        .required("Required"),
      breed: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
      species: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
      description: Yup.string().max(512, "Must be 512 characters or less"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      if (account && account.account_type === "owner") {
        const response = await editPetProfile.mutateAsync({
          ...values,
        });

        if (response.status === 200 && response.data.status === "OK") {
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
      title="Edit Pet Profile"
      error={error}
      submitButton={
        <button
          className={`btn btn-primary fluid ${
            editPetProfile.isLoading ? "loading" : ""
          }`}
          type="submit"
        >
          Save
        </button>
      }
      {...props}
    >
      <TextInputField id="name" type="text" placeholder="Name" />
      <SelectField
        id="sex"
        options={[
          {
            id: "M",
            value: "M",
            label: "Male",
          },
          {
            id: "F",
            value: "F",
            label: "Female",
          },
        ]}
        placeholder="Sex"
      />

      <div className="grid grid-flow-row grid-cols-2 gap-4">
        <div>
          <TextInputField id="breed" type="text" placeholder="Breed" />
        </div>
        <div>
          <TextInputField id="species" type="text" placeholder="Species" />
        </div>
      </div>
      <TextAreaField
        id="description"
        type="text"
        placeholder="Description"
        required={false}
      />
      <DateField
        id="birthdate"
        placeholder="Birthdate"
        max={moment().format("YYYY-MM-DD")}
      />
    </Form>
  );
}
