import Form from "@components/Form/Form";
import TextInputField from "@components/Form/Field/TextInputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import Link from "next/link";
import { useMutation } from "react-query";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useContext, useState } from "react";
import AccountContext from "@components/context/Account/AccountContext";
import Router from "next/router";
import { makeApiPostRequest } from "utility";
import SelectField from "@components/Form/Field/SelectField";
import TextAreaField from "@components/Form/Field/TextAreaField";
import DateField from "@components/Form/Field/DateField";

export default function PetForm() {
  const [error, setError] = useState();
  const { account } = useContext(AccountContext);

  const createNewPetProfile = useMutation(
    ({ owner_id, name, sex, breed, birthdate, species, description }) => {
      return makeApiPostRequest("/api/pet/new", {
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
      name: "",
      sex: "",
      breed: "",
      birthdate: "",
      species: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
      sex: Yup.string().oneOf(["M", "F"], "M or F only").required("Required"),
      birthdate: Yup.date(),
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
        const response = await createNewPetProfile.mutateAsync({
          ...values,
          owner_id: account.id,
        });

        if (response.status === 200) {
          console.log(response.data);
        }
      }
    },
  });

  return (
    <Form
      className="card w-96 bg-base-100 shadow-xl"
      formik={formik}
      title="Pet"
      error={error}
      submitButton={
        <button
          className={`btn btn-primary fluid ${false ? "loading" : ""}`}
          type="submit"
        >
          Create Pet Profile
        </button>
      }
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
        <TextInputField id="breed" type="text" placeholder="Breed" />
        <TextInputField id="species" type="text" placeholder="Species" />
      </div>
      <TextAreaField
        id="description"
        type="text"
        placeholder="Description"
        required={false}
      />
      <DateField id="birthdate" placeholder="Birthdate" />
    </Form>
  );
}
