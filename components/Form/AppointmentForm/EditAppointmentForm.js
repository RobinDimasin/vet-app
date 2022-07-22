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
import { LoadingDial, makeApiPostRequest } from "utility";
import useAccount from "@components/hooks/useAccount";
import FormModal from "@components/Modal/FormModal";
import NewPetForm from "@components/Form/PetForm/NewPetForm";
import moment from "moment";

export default function EditAppointmentForm({
  id,
  values = {
    date: "",
    pets: [],
  },
  onSuccess = () => {},
  onError = () => {},
  ...props
}) {
  const queryClient = useQueryClient();
  const { account, loading } = useAccount({ type: "owner" });

  const [error, setError] = useState();

  const editAppointment = useMutation(async ({ date, pets }) => {
    return await makeApiPostRequest("/api/appointment/edit", {
      id,
      date,
      pets,
    });
  });

  const { data: reasons = [], isLoading: isPetsLoading } = useQuery(
    account && "get_reasons",
    async () => {
      const response = await makeApiPostRequest("/api/entity/reason/getAll");
      if (response.status === 200 && response.data.status === "OK") {
        return response.data.data;
      }

      throw new Error("Error getting reasons");
    }
  );

  const { data: pets = [], isLoading: isReasonsLoading } = useQuery(
    account && "get_pets",
    async () => {
      const response = await makeApiPostRequest("/api/account/owner/getPets", {
        id: account.id,
      });

      if (response.status === 200 && response.data.status === "OK") {
        return response.data.data;
      }

      throw new Error("Error getting pets");
    }
  );

  const formik = useFormik({
    initialValues: {
      ...values,
      date: moment(values.date).format("YYYY-MM-DD"),
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
          })
        )
        .min(1, "Must have at least one pet"),
    }),
    onSubmit: async (values, { setFieldError, resetForm }) => {
      // alert(JSON.stringify(values, null, 2));
      if (account && account.account_type === "owner") {
        const response = await editAppointment.mutateAsync({
          date: values.date,
          pets: values.pets.map((pet) => {
            return {
              pet_id: pet.pet_id,
              reason_id: pet.reason,
              reason_desc: pet.description,
            };
          }),
        });

        if (response.status === 200 && response.data.status === "OK") {
          resetForm();

          const appointments = response.data.data;
          onSuccess({
            form_id: appointments[0].form_id,
            date: appointments[0].appt_date,
            pets: appointments.map((appointment) => {
              return {
                pet_id: appointment.pet_id,
                reason: appointment.reason_id,
                description: appointment.reason_desc,
              };
            }),
          });
        } else {
          onError();
        }
      }
    },
  });

  return isPetsLoading && isReasonsLoading ? (
    <LoadingDial />
  ) : (
    <FormikProvider value={formik}>
      <Form
        className="w-96"
        formik={formik}
        title="Appointment"
        error={error}
        submitButton={
          <button
            className={`btn btn-primary fluid ${
              editAppointment.isLoading ? "loading" : ""
            }`}
            type="submit"
          >
            Save
          </button>
        }
        {...props}
      >
        <DateField
          id="date"
          placeholder="Date"
          min={moment().format("YYYY-MM-DD")}
        />
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
                          {
                            pets.find(
                              (petInChoices) => petInChoices.id === pet.pet_id
                            )?.name
                          }
                        </p>
                        <button
                          className="btn btn-sm btn-ghost btn-circle absolute right-2 top-2"
                          onClick={() => remove(index)}
                        >
                          <Icon icon={<CloseIcon />} />
                        </button>
                      </h2>
                      {/* <SelectField
                      id={`pets.${index}.pet_id`}
                      name={`pets.${index}.pet_id`}
                      placeholder="Pet"
                      options={pets
                        .filter(
                          (petInChoices) =>
                            !formik.values.pets.some((petInForm) => {
                              return (
                                petInForm.pet_id === petInChoices.id &&
                                pet.pet_id !== petInChoices.id
                              );
                            })
                        )
                        .map((pet) => {
                          return {
                            id: pet.id,
                            value: pet.id,
                            label: pet.name,
                          };
                        })}
                    /> */}
                      <SelectField
                        id={`pets.${index}.reason`}
                        name={`pets.${index}.reason`}
                        placeholder="Reason"
                        options={reasons.map((reason) => {
                          return {
                            id: reason.id,
                            value: reason.id,
                            label: reason.reason,
                          };
                        })}
                      />
                      <TextAreaField
                        id={`pets.${index}.description`}
                        name={`pets.${index}.description`}
                        placeholder="Description"
                      />
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
          <FormModal
            trigger={
              <span className="label-text-alt link link-primary text-start text-xs">
                Create new pet profile
              </span>
            }
            form={<NewPetForm />}
            onSuccess={() => {
              queryClient.invalidateQueries("get_pets");
            }}
          />
        </label>
      </Form>
    </FormikProvider>
  );
}
