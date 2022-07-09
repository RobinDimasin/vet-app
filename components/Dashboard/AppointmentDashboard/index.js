import EditAppointmentForm from "@components/AppointmentForm/EditAppointmentForm";
import NewAppointmentForm from "@components/AppointmentForm/NewAppointmentForm";
import DeleteIcon from "@components/icons/DeleteIcon";
import EditIcon from "@components/icons/EditIcon";
import Icon from "@components/icons/Icon";
import InfoIcon from "@components/icons/InfoIcon";
import Modal from "@components/Modal";
import FormModal from "@components/Modal/FormModal";
import EditPetForm from "@components/PetForm/EditPetForm";
import NewPetForm from "@components/PetForm/NewPetForm";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { makeApiPostRequest } from "utility";
import Dashboard from "..";

function makeProperty(label, value, formatter = (v) => v) {
  return value ? (
    <p className="break-words">
      <b>{label}: </b>
      {formatter(value)}
    </p>
  ) : null;
}

function AppointmentPetBriefInfo({ appointmentPet }) {
  const { data: reasons = [] } = useQuery("get_reasons", async () => {
    const response = await makeApiPostRequest("/api/entity/reason/getAll");
    if (response.status === 200 && response.data.status === "OK") {
      return response.data.data;
    }

    return [];
  });

  const { data: pet, isLoading } = useQuery(appointmentPet.pet_id, async () => {
    const response = await makeApiPostRequest("/api/pet/details", {
      id: appointmentPet.pet_id,
    });

    if (response.status === 200 && response.data.status === "OK") {
      return response.data.data[0];
    }

    throw new Error("Error fetching pet");
  });

  const [reasonName, setReasonName] = useState(appointmentPet.reason);

  useEffect(() => {
    const reason = reasons.find(
      (reason) => reason.id === appointmentPet.reason
    );

    if (reason) {
      setReasonName(reason.reason);
    }
  }, [reasons, appointmentPet.reason]);

  return isLoading || !pet ? (
    <div>Loading...</div>
  ) : (
    <div className="break-inside card card-compact bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="flex justify-between">
          <div className="truncate max-w-xs">
            <b>{pet.name}</b>
            <p className="break-words whitespace-normal">
              <b>{reasonName}:</b> {appointmentPet.description}
            </p>
          </div>
          <div className="my-auto">
            <Modal
              trigger={
                <button className="btn btn-ghost btn-sm btn-circle">
                  <Icon icon={<InfoIcon />} />
                </button>
              }
            >
              <div>
                <h2 className="card-title text-ellipsis font-bold truncate">
                  {pet.name}
                </h2>
                {makeProperty("Birthdate", pet.birthdate, (birthdate) =>
                  moment(birthdate).format("MMMM Do YYYY")
                )}
                {makeProperty("Sex", pet.sex)}
                {makeProperty("Breed", pet.breed)}
                {makeProperty("Species", pet.species)}
                {makeProperty("Description", pet.description)}
                <p className="break-words whitespace-normal">
                  <b>{reasonName}:</b> {appointmentPet.description}
                </p>
              </div>
            </Modal>
          </div>
        </h2>
      </div>
    </div>
  );
}

function AppointmentInfo({ data: _appointment, onDelete = () => {} }) {
  const queryClient = useQueryClient();
  const [appointment, setAppointment] = useState(_appointment);
  const [deleting, setDeleting] = useState(false);
  const [deletionConfirming, setDeletionConfirming] = useState(false);

  return (
    <div className="break-inside card card-compact bg-base-100 shadow-xl">
      <div className="card-body">
        <div>
          <h2 className="card-title text-ellipsis font-bold truncate">
            {moment(appointment.date).format("MMMM Do YYYY")}
          </h2>
          <div className="space-y-2">
            {appointment.pets.map((pet) => {
              return (
                <AppointmentPetBriefInfo
                  key={pet.pet_id}
                  appointmentPet={pet}
                />
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 drop-shadow">
          <FormModal
            trigger={
              <button className="btn btn-success btn-sm">
                <Icon icon={<EditIcon />} />
                Edit
              </button>
            }
            form={
              <EditAppointmentForm
                id={appointment.form_id}
                values={{
                  ...appointment,
                  date: moment(appointment.date).format("YYYY-MM-DD"),
                }}
              />
            }
            onSuccess={(appointment) => {
              setAppointment(appointment);
              appointment.pets.forEach((pet) => {
                queryClient.invalidateQueries(pet.pet_id);
              });
            }}
          />
          <button
            className={`btn btn-error btn-sm drop-shadow ${
              deleting ? "loading btn-disabled" : ""
            }`}
            onClick={async () => {
              if (deletionConfirming) {
                setDeleting(true);
                const response = await makeApiPostRequest(
                  "/api/appointment/delete",
                  {
                    id: appointment.form_id,
                  }
                );

                if (response.status === 200 && response.data.status === "OK") {
                  onDelete(appointment);
                }
                setDeleting(false);
                setDeletionConfirming(false);
              } else {
                setDeletionConfirming(true);
              }
            }}
          >
            {deleting ? (
              "Deleting..."
            ) : !deletionConfirming ? (
              <>
                <Icon icon={<DeleteIcon />} />
                Delete
              </>
            ) : (
              "Are you sure?"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppointmentDashboard({ accountType, ...props }) {
  return (
    <Dashboard
      id="appointments"
      keyFunc={(form) => form.form_id}
      name="Appointments"
      accountType={accountType}
      dataComponent={<AppointmentInfo />}
      newRecordForm={<NewAppointmentForm />}
      newRecordButtonLabel="Make an Appointment"
      noRecordLabel="No appointments found"
      getData={async ({ id }) => {
        const response = await makeApiPostRequest(
          "/api/account/owner/getAppointments",
          {
            id,
          }
        );

        if (response.status === 200 && response.data.status === "OK") {
          const forms = response.data.data;

          return forms
            .map((appointments) => {
              if (appointments.length == 0) {
                return null;
              }

              return {
                form_id: appointments[0].form_id,
                date: appointments[0].appt_date,
                pets: appointments.map((appointment) => {
                  return {
                    pet_id: appointment.pet_id,
                    reason: appointment.reason_id,
                    description: appointment.reason_desc,
                  };
                }),
              };
            })
            .filter((form) => form)
            .sort((a, b) => {
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
        }

        return [];
      }}
      {...props}
    />
  );
}
