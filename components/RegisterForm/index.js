import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext, useEffect, useState } from "react";
import Form from "@components/Form/Form";
import { useMutation } from "react-query";
import axios from "axios";
import TextInputField from "@components/Form/Field/TextInputField";
import CryptoJS from "crypto-js";
import Router from "next/router";
import AccountContext from "@components/context/Account/AccountContext";
import { getBaseURL, makeApiPostRequest } from "utility";

export default function RegisterForm() {
  const [error, setError] = useState();
  const { setAccount } = useContext(AccountContext);

  const register = useMutation((data) => {
    return makeApiPostRequest(`/api/entity/owner/new`, {
      args: [data],
    });
  });

  const login = useMutation((data) => {
    return makeApiPostRequest(`/api/entity/account/login`, {
      args: [data],
    });
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      address: "",
      contact_number: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      username: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
      first_name: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
      last_name: Yup.string()
        .max(64, "Must be 64 characters or less")
        .required("Required"),
      middle_name: Yup.string().max(64, "Must be 64 characters or less"),
      address: Yup.string()
        .max(256, "Must be 256 characters or less")
        .required("Required"),
      contact_number: Yup.string()
        .max(11, "Must be 11 characters or less")
        .matches(/09[0-9]{9}/, "Invalid contact number. Example: 09123456789")
        .required("Required"),
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
            hashed_password,
          });

          if (
            loginResponse.status === 200 &&
            loginResponse.data.status === "OK"
          ) {
            setAccount(loginResponse.data.data.account);
            Router.push("/");
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
      title="Register"
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
      footer={
        <p className="text-center text-xs">
          Already registered?{" "}
          <Link href="/login">
            <a className="link link-primary">Login</a>
          </Link>
        </p>
      }
    >
      <TextInputField id="email" type="email" placeholder="Email Address" />
      <TextInputField id="username" placeholder="Username" />
      <div className="grid grid-flow-row grid-cols-3 gap-4">
        <TextInputField id="last_name" placeholder="Last Name" />
        <TextInputField id="first_name" placeholder="First Name" />
        <TextInputField
          id="middle_name"
          placeholder="Middle Name"
          required={false}
        />
      </div>
      <TextInputField id="address" placeholder="Address" />
      <TextInputField
        id="contact_number"
        type="tel"
        placeholder="Contact Number"
        pattern="09[0-9]{9}"
      />
      <TextInputField id="password" type="password" placeholder="Password" />
    </Form>
  );
}
