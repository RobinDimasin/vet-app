import AdminRegisterForm from "@components/RegisterForm/AdminRegisterForm";
import OwnerRegisterForm from "@components/RegisterForm/OwnerRegisterForm";
import VeterinarianRegisterForm from "@components/RegisterForm/VeterinarianRegisterForm";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const GetRegisterForm = (type) => {
  switch (type) {
    case "admin":
      return AdminRegisterForm;
    case "veterinarian":
      return VeterinarianRegisterForm;
    case "owner":
      return OwnerRegisterForm;
    default:
      return OwnerRegisterForm;
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const { type = "owner" } = router.query;

  return (
    <div className="hero">
      <div className="hero-content flex-col lg:flex-row-reverse md:px-[10%]">
        <div className="card w-[32rem] bg-base-100 shadow-xl">
          {React.createElement(GetRegisterForm(type))}
        </div>
      </div>
    </div>
  );
}
