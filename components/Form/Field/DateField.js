import { useContext, useEffect, useState } from "react";
import FormContext from "../FormContext";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import TextInputField from "./TextInputField";

export default function DateField(props) {
  return <TextInputField {...props} type="date" />;
}
