import Form from "@components/Form/Form";
import TextInputField from "@components/Form/Field/TextInputField";
import * as Yup from "yup";
import {
  Formik,
  Field,
  FieldArray,
  useFormik,
  FormikProvider,
  ErrorMessage,
} from "formik";
import { useContext, useEffect, useState } from "react";
import SelectField from "@components/Form/Field/SelectField";
import DateField from "@components/Form/Field/DateField";
import TextAreaField from "@components/Form/Field/TextAreaField";
import Link from "next/link";
import AccountContext from "@components/context/Account/AccountContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Icon from "@components/icons/Icon";
import InfoIcon from "@components/icons/InfoIcon";
import CloseIcon from "@components/icons/CloseIcon";
import { LoadingDial, makeApiPostRequest, makeName } from "utility";
import useAccount from "@components/hooks/useAccount";
import FormModal from "@components/Modal/FormModal";
import NewPetForm from "@components/PetForm/NewPetForm";
import NumberInputField from "@components/Form/Field/NumberInputField";
import moment from "moment";

export default function FillUpAppointmentForm({
  id,
  onSuccess = () => {},
  onError = () => {},
  ...props
}) {
  const queryClient = useQueryClient();
  const { account, loading: isAccountLoading } = useAccount({
    type: "veterinarian",
  });

  const [error, setError] = useState();
  const [hasNextAppointment, setHasNextAppointment] = useState([]);

  const fillUpAppointment = useMutation(async ({ date, pets }) => {
    return await makeApiPostRequest("/api/appointment/fillup", {
      id,
      date,
      pets,
    });
  });

  const { data: appointment, isLoading: isAppointmentLoading } = useQuery(
    id,
    async () => {
      const response = await makeApiPostRequest("/api/form/details", {
        id,
      });

      if (response.status === 200 && response.data.status === "OK") {
        const appointments = response.data.data;

        return {
          form_id: appointments[0].form_id,
          date: appointments[0].appt_date,
          owner_id: appointments[0].owner_id,
          pets: appointments.map((appointment) => {
            return {
              pet_id: appointment.pet_id,
              reason: appointment.reason_id,
              description: appointment.reason_desc,
              prescription: appointment.prescription,
              weight: appointment.weight,
              temperature: appointment.temperature,
              veterinarian_license_no: account.license_no,
            };
          }),
        };
      }

      return null;
    }
  );

  const { data: reasons = [], isLoading: isReasonsLoading } = useQuery(
    account && "get_reasons",
    async () => {
      const response = await makeApiPostRequest("/api/entity/reason/getAll");
      if (response.status === 200 && response.data.status === "OK") {
        return response.data.data;
      }

      return [];
    }
  );

  const { data: pets = [], isLoading: isPetsLoading } = useQuery(
    appointment && "get_pets",
    async () => {
      const response = await makeApiPostRequest("/api/account/owner/getPets", {
        id: appointment.owner_id,
      });

      if (response.status === 200 && response.data.status === "OK") {
        return response.data.data;
      }
      return [];
    }
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: appointment
      ? {
          veterinarian_name: "Vet name: " + makeName(account),
          veterinarian_license_no: account.license_no,
          veterinarian_license_no_label: "License No.: " + account.license_no,
          date: moment(appointment.date).format("YYYY-MM-DD"),
          date_label:
            "Date: " + moment(appointment.appt_date).format("YYYY-MM-DD"),
          pets: appointment.pets.map((pet) => {
            return {
              ...pet,
              reason_label:
                "Reason: " +
                reasons.find((reason) => reason.id === pet.reason).reason,
              description_label: "Description: " + pet.description,
              next_appt_date: null,
              next_appt_reason: null,
              next_appt_description: null,
            };
          }),
        }
      : {
          veterinarian_name: "",
          veterinarian_license_no: "",
          date: "",
          pets: [],
        },
    validationSchema: Yup.object({
      date: Yup.date()
        .min(moment().format("YYYY-MM-DD"), "Date cannot be from the past")
        .required("Required"),
      pets: Yup.array()
        .of(
          Yup.object({
            pet_id: Yup.string().required("Required"),
            reason: Yup.string().required("Required"),
            description: Yup.string()
              .max(512, "Must be 512 characters or less")
              .required("Required"),
            weight: Yup.number()
              .typeError("Must be a number")
              .required("Required"),
            temperature: Yup.number()
              .typeError("Must be a number")
              .required("Required"),
            prescription: Yup.string()
              .typeError("Must be a string")
              .required("Required"),
            veterinarian_license_no: Yup.string()
              .max(64, "Must be 64 characters or less")
              .required("Required"),
            next_appt_date: Yup.date().nullable(),
            next_appt_reason: Yup.string().nullable(),
            next_appt_description: Yup.string()
              .max(512, "Must be 512 characters or less")
              .nullable(),
          })
        )
        .min(1, "Must have at least one pet"),
    }),
    onSubmit: async (values, { setFieldError, resetForm }) => {
      if (account && account.account_type === "veterinarian") {
        const response = await fillUpAppointment.mutateAsync({
          id,
          date: values.date,
          pets: values.pets.map((pet) => {
            return {
              ...pet,
              pet_id: pet.pet_id,
              reason_id: pet.reason,
              reason_desc: pet.description,
              ...(!hasNextAppointment.includes(pet.pet_id)
                ? {
                    next_appt_date: null,
                    next_appt_reason: null,
                    next_appt_description: null,
                  }
                : {}),
            };
          }),
        });

        if (response.status === 200 && response.data.status === "OK") {
          resetForm();

          const { updatedFormAppointments, newAppointments } =
            response.data.data;

          const updatedForm = {
            form_id: updatedFormAppointments[0].form_id,
            date: updatedFormAppointments[0].appt_date,
            owner_id: updatedFormAppointments[0].owner_id,
            pets: updatedFormAppointments.map((appointment) => {
              return {
                pet_id: appointment.pet_id,
                reason: appointment.reason_id,
                description: appointment.reason_desc,
              };
            }),
          };

          onSuccess(updatedForm);

          queryClient.setQueriesData(
            "veterinarian_appointments",
            (oldForms) => {
              const withUpdatedForm = [
                updatedForm,
                ...oldForms.filter(
                  (form) => form.form_id !== updatedFormAppointments.form_id
                ),
              ];

              const newFormsFormatted = newAppointments
                .map((appointments) => {
                  if (appointments.length == 0) {
                    return null;
                  }

                  return {
                    form_id: appointments[0].form_id,
                    date: appointments[0].appt_date,
                    owner_id: appointments[0].owner_id,
                    fulfilled: appointments.some(
                      (appointment) => appointment.veterinarian_license_no
                    ),
                    pets: appointments.map((appointment) => {
                      return {
                        ...appointment,
                        pet_id: appointment.pet_id,
                        reason: appointment.reason_id,
                        description: appointment.reason_desc,
                      };
                    }),
                  };
                })
                .filter((form) => form);

              return [...newFormsFormatted, ...withUpdatedForm].sort((a, b) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
              });
            }
          );
        } else {
          onError();
        }
      }
    },
  });

  return isAccountLoading || isAppointmentLoading || !appointment ? (
    <LoadingDial />
  ) : (
    <FormikProvider value={formik}>
      <Form
        className="w-96"
        formik={formik}
        title="Appointment Fill Up"
        error={error}
        submitButton={
          <button
            className={`btn btn-accent fluid ${false ? "loading" : ""}`}
            type="submit"
          >
            Fill Up
          </button>
        }
        {...props}
      >
        <div className="grid grid-flow-row grid-cols-2 gap-4">
          <TextInputField
            id="veterinarian_license_no_label"
            name="veterinarian_license_no_label"
            placeholder="License No."
            disabled
          />
          <TextInputField
            id="veterinarian_name"
            name="veterinarian_name"
            placeholder="Veterinarian Name"
            disabled
          />
        </div>
        <TextInputField id="date_label" placeholder="Choose a date" disabled />

        <FieldArray name="pets">
          {({ insert, remove, push }) => (
            <div>
              {formik.values.pets.length > 0 &&
                formik.values.pets.map((pet, index) => (
                  <div
                    className="card card-compact w-full bg-base-100 border-2 border-dashed mb-2"
                    key={index}
                  >
                    <div className="card-body">
                      <h2 className="card-title flex justify-between">
                        <p>
                          {pets.length > 0
                            ? pets.find((petInChoices) => {
                                return petInChoices.id === pet.pet_id;
                              })?.name
                            : "Loading..."}
                        </p>
                      </h2>
                      <TextInputField
                        id={`pets.${index}.reason_label`}
                        name={`pets.${index}.reason_label`}
                        placeholder="Reason"
                        disabled
                      />
                      <TextAreaField
                        id={`pets.${index}.description_label`}
                        name={`pets.${index}.description_label`}
                        placeholder="Description"
                        disabled
                      />
                      <div className="grid grid-flow-row grid-cols-2 gap-4">
                        <div>
                          <NumberInputField
                            id={`pets.${index}.weight`}
                            name={`pets.${index}.weight`}
                            placeholder="Weight"
                          />
                        </div>
                        <div>
                          <NumberInputField
                            id={`pets.${index}.temperature`}
                            name={`pets.${index}.temperature`}
                            placeholder="Temperature"
                          />
                        </div>
                      </div>
                      <TextAreaField
                        id={`pets.${index}.prescription`}
                        name={`pets.${index}.prescription`}
                        placeholder="Prescription"
                      />
                      {!hasNextAppointment.includes(pet.pet_id) ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-xs btn-outline border-dashed border-2"
                          onClick={() => {
                            setHasNextAppointment((hasNextAppointment) => {
                              return [...hasNextAppointment, pet.pet_id];
                            });
                          }}
                        >
                          Setup Next Appointment
                        </button>
                      ) : (
                        <>
                          <br />
                          <DateField
                            id={`pets.${index}.next_appt_date`}
                            placeholder="Choose Next Appointment Date"
                            min={moment().format("YYYY-MM-DD")}
                          />
                          <SelectField
                            id={`pets.${index}.next_appt_reason`}
                            name={`pets.${index}.next_appt_reason`}
                            placeholder="Choose Next Appointment Reason"
                            options={reasons.map((reason) => {
                              return {
                                id: reason.id,
                                value: reason.id,
                                label: reason.reason,
                              };
                            })}
                          />
                          <TextAreaField
                            id={`pets.${index}.next_appt_description`}
                            name={`pets.${index}.next_appt_description`}
                            placeholder="Next Appointment Description"
                          />
                          <button
                            type="button"
                            className="btn btn-primary btn-xs btn-outline border-dashed border-2"
                            onClick={() => {
                              setHasNextAppointment((hasNextAppointment) => {
                                return hasNextAppointment.filter(
                                  (id) => id !== pet.pet_id
                                );
                              });
                            }}
                          >
                            Remove Next Appointment
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </FieldArray>
        <label className="label py-0 space-y-0">
          <span className="label-text text-xs text-error">
            {formik.errors.pets === "string" ? formik.errors.pets : null}
          </span>
        </label>
      </Form>
    </FormikProvider>
  );
}
