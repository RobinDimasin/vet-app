import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext, useState } from "react";
import Form from "@components/Form/Form";
import { useMutation } from "react-query";
import TextInputField from "@components/Form/Field/TextInputField";
import CryptoJS from "crypto-js";
import Router from "next/router";
import AccountContext from "@components/context/Account/AccountContext";
import { makeApiPostRequest } from "utility";

export default function VeterinarianRegisterForm() {
  const [error, setError] = useState();
  const { setAccount } = useContext(AccountContext);

  const register = useMutation((data) => {
    return makeApiPostRequest(`/api/account/register/veterinarian`, data);
  });

  const login = useMutation(({ email, password }) => {
    return makeApiPostRequest("/api/account/login", {
      email,
      hashed_password: CryptoJS.SHA512(password).toString(),
    });
  });

  const re =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  const formik = useFormik({
    initialValues: {
      email: "",
      profile_picture_url: "",
      username: "",
      license_no: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      profile_picture_url: Yup.string().matches(re, "URL is not valid"),
      username: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
      license_no: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
      first_name: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
      last_name: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
      middle_name: Yup.string().max(64, "Must be 64 characters or less"),
      password: Yup.string()
        .max(256, "Must be 256 characters or less")
        .required("Required"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      setError();

      const data = { ...values };
      const hashed_password = CryptoJS.SHA512(data.password).toString();

      delete data.password;

      const registerResponse = await register.mutateAsync({
        ...data,
        hashed_password,
      });

      if (registerResponse.status === 200) {
        if (registerResponse.data.status === "OK") {
          const loginResponse = await login.mutateAsync({
            email: data.email,
            password: values.password,
          });

          if (
            loginResponse.status === 200 &&
            loginResponse.data.status === "OK"
          ) {
            setAccount(loginResponse.data.data.account);
            Router.push(Router.query.destination ?? "/");
          }
        } else {
          setError(registerResponse.data.message);
        }
      }
    },
  });

  return (
    <Form
      formik={formik}
      title="Veterinarian Register"
      error={error}
      submitButton={
        <button
          className={`btn btn-primary fluid ${
            register.isLoading ? "loading" : ""
          }`}
          type="submit"
        >
          REGISTER
        </button>
      }
    >
      <TextInputField id="email" type="email" placeholder="Email Address" />
      <TextInputField id="username" placeholder="Username" />
      <TextInputField
        id="profile_picture_url"
        placeholder="Profile Picture URL"
      />
      <TextInputField id="license_no" placeholder="License Number" />
      <div className="grid grid-flow-row grid-cols-3 gap-4">
        <div>
          <TextInputField id="last_name" placeholder="Last Name" />
        </div>
        <div>
          <TextInputField id="first_name" placeholder="First Name" />
        </div>
        <div>
          <TextInputField
            id="middle_name"
            placeholder="Middle Name"
            required={false}
          />
        </div>
      </div>
      <TextInputField id="password" type="password" placeholder="Password" />
    </Form>
  );
}
