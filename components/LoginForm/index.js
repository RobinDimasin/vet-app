import Form from "@components/Form/Form";
import TextInputField from "@components/Form/TextInputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import Link from "next/link";
import { useMutation } from "react-query";
import axios from "axios";
import CryptoJS from "crypto-js";
import { BASE_URL } from "constants";
import { useContext, useState } from "react";
import AccountContext from "@components/context/Account/AccountContext";
import { useRouter } from "next/router";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState();
  const { account, setAccount } = useContext(AccountContext);

  const login = useMutation((data) => {
    return axios.post(BASE_URL + `/api/entity/account/login`, {
      args: [data],
    });
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .max(256, "Must be 256 characters or less")
        .required("Required"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      const response = await login.mutateAsync({
        email: values.email,
        hashed_password: CryptoJS.SHA512(values.password).toString(),
      });

      if (response.status === 200) {
        if (response.data.status === "OK") {
          setAccount(response.data.data.account);
          router.push(BASE_URL);
        } else {
          setError(response.data.message);
        }
      } else {
        setError("Something went wrong.");
      }

      //   alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Form
      className="card w-96 bg-base-100 shadow-xl"
      formik={formik}
      title="Login"
      error={error}
      submitButton={
        <button
          className={`btn btn-primary fluid ${
            login.isLoading ? "loading" : ""
          }`}
          type="submit"
        >
          LOGIN
        </button>
      }
      footer={
        <p className="text-center text-xs">
          Not registered yet?{" "}
          <Link href="/register">
            <a className="link link-primary">Register Now!</a>
          </Link>
        </p>
      }
    >
      <TextInputField id="email" type="email" placeholder="Email Address" />
      <TextInputField
        id="password"
        type="password"
        placeholder="Password"
        label={
          <Link href="/forgot-password">
            <a className="label-text-alt link link-primary text-start text-xs">
              Forgot Password?
            </a>
          </Link>
        }
      />
    </Form>
  );
}
