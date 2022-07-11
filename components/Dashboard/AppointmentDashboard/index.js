import EditAppointmentForm from "@components/AppointmentForm/EditAppointmentForm";
import FillUpAppointmentForm from "@components/AppointmentForm/FillUpAppointmentForm";
import NewAppointmentForm from "@components/AppointmentForm/NewAppointmentForm";
import AccountContext from "@components/context/Account/AccountContext";
import DeleteIcon from "@components/icons/DeleteIcon";
import EditIcon from "@components/icons/EditIcon";
import Icon from "@components/icons/Icon";
import InfoIcon from "@components/icons/InfoIcon";
import PencilIcon from "@components/icons/PencilIcon";
import Modal from "@components/Modal";
import FormModal from "@components/Modal/FormModal";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import {
  LoadingDial,
  makeApiPostRequest,
  makeName,
  makeProperty,
} from "utility";
import Dashboard from "..";
import { AccountMoreInfo } from "../AccountDashboard";

function AppointmentPetBriefInfo({ appointmentPet }) {
  const { data: reasons = [] } = useQuery("get_reasons", async () => {
    const response = await makeApiPostRequest("/api/entity/reason/getAll");
    if (response.status === 200 && response.data.status === "OK") {
      return response.data.data;
    }

    return [];
  });

  const { data: pet, isLoading: isPetLoading } = useQuery(
    appointmentPet.pet_id,
    async () => {
      const response = await makeApiPostRequest("/api/pet/details", {
        id: appointmentPet.pet_id,
      });

      if (response.status === 200 && response.data.status === "OK") {
        return response.data.data[0];
      }

      throw new Error("Error fetching pet");
    }
  );

  const { data: veterinarian, isLoading: isVeterinarianLoading } = useQuery(
    appointmentPet.veterinarian_license_no,
    async () => {
      const response = await makeApiPostRequest(
        "/api/account/getAccountDetailsOf",
        {
          license_no: appointmentPet.veterinarian_license_no,
          type: "veterinarian",
          key: "license_no",
        }
      );

      if (response.status === 200 && response.data.status === "OK") {
        return response.data.data;
      } else {
        throw new Error("Invalid credentials");
      }
    }
  );

  const [reasonName, setReasonName] = useState(appointmentPet.reason);

  useEffect(() => {
    const reason = reasons.find(
      (reason) => reason.id === appointmentPet.reason
    );

    if (reason) {
      setReasonName(reason.reason);
    }
  }, [reasons, appointmentPet.reason]);

  return isPetLoading || !pet ? (
    <div>Loading...</div>
  ) : (
    <div className="break-inside card card-compact bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="flex justify-between">
          <div className="truncate max-w-xs">
            <Modal trigger={<b className="link">{pet.name}</b>}>
              <div>
                <h2 className="card-title text-ellipsis font-bold truncate">
                  {pet.name}
                </h2>
                {makeProperty("birthdate", pet)}
                {makeProperty("sex", pet)}
                {makeProperty("breed", pet)}
                {makeProperty("species", pet)}
                {makeProperty("description", pet)}
                <p className="break-words whitespace-normal">
                  <b>{reasonName}:</b> {appointmentPet.description}
                </p>
              </div>
            </Modal>
            <p className="break-words whitespace-normal">
              {makeProperty("description", appointmentPet, {
                key: () => reasonName,
              })}
              {makeProperty("weight", appointmentPet)}
              {makeProperty("temperature", appointmentPet)}
              {makeProperty("prescription", appointmentPet)}
              {veterinarian ? (
                <>
                  <b>Processed by: </b>
                  {veterinarian ? (
                    <Modal
                      trigger={
                        <span className="link">{makeName(veterinarian)}</span>
                      }
                    >
                      <AccountMoreInfo
                        account={{
                          ...veterinarian,
                          id: veterinarian.account_id,
                        }}
                        doFetch={true}
                      />
                    </Modal>
                  ) : (
                    "Loading..."
                  )}
                </>
              ) : null}
            </p>
          </div>
        </h2>
      </div>
    </div>
  );
}

function AppointmentInfo({
  data: _appointment,
  onDelete = () => {},
  showOwner = false,
  showDelete = true,
  showEdit = true,
  showFillUp = false,
}) {
  const queryClient = useQueryClient();
  const [appointment, setAppointment] = useState(_appointment);
  const [deleting, setDeleting] = useState(false);
  const [deletionConfirming, setDeletionConfirming] = useState(false);

  const { data: owner } = useQuery(
    showOwner && appointment.owner_id,
    async () => {
      const response = await makeApiPostRequest(
        "/api/account/getAccountDetailsOf",
        {
          id: appointment.owner_id,
          type: "owner",
        }
      );

      if (response.status === 200 && response.data.status === "OK") {
        return response.data.data;
      } else {
        throw new Error("Invalid credentials");
      }
    }
  );

  return (
    <div className="break-inside card card-compact bg-base-100 shadow-xl">
      <div className="card-body">
        <div>
          <h2 className="card-title text-ellipsis font-bold truncate">
            {moment(appointment.date).format("MMMM Do YYYY")}
            {appointment.fulfilled ? (
              <span className="badge badge-success badge-sm">COMPLETED</span>
            ) : !moment(moment(appointment.date).format("YYYY-MM-DD")).isBefore(
                moment().format("YYYY-MM-DD"),
                "day"
              ) ? (
              <span className="badge badge-info badge-sm">PENDING</span>
            ) : (
              <span className="badge badge-error badge-sm">OVERDUE</span>
            )}
          </h2>
          {showOwner ? (
            <>
              <b>Owner:</b>{" "}
              {owner ? (
                <Modal trigger={<span className="link">{owner.email}</span>}>
                  <AccountMoreInfo
                    account={{
                      ...owner,
                      id: owner.account_id,
                    }}
                    doFetch={true}
                  />
                </Modal>
              ) : (
                "Loading..."
              )}
            </>
          ) : null}
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
        <div
          className={`grid grid-cols-${
            showDelete + showEdit
          } gap-4 drop-shadow`}
        >
          {!appointment.fulfilled && showEdit && (
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
                // queryClient.invalidateQueries(id);
              }}
            />
          )}
          {!appointment.fulfilled && showDelete && (
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

                  if (
                    response.status === 200 &&
                    response.data.status === "OK"
                  ) {
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
          )}
        </div>
        {showFillUp && (
          <FormModal
            trigger={
              <button className="btn btn-accent btn-sm">
                <Icon icon={<PencilIcon />} /> Fill Up
              </button>
            }
            form={<FillUpAppointmentForm id={appointment.form_id} />}
            onSuccess={(appointment) => {
              setAppointment(appointment);
              // queryClient.invalidateQueries(id);
            }}
          />
        )}
      </div>
    </div>
  );
}

const formatAppointmentsResponse = (response) => {
  if (response.status === 200 && response.data.status === "OK") {
    const forms = response.data.data
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
      .filter((form) => form)
      .sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

    return forms;
  }

  return [];
};

const categories = {
  pending: (form) =>
    !form.fulfilled &&
    !moment(moment(form.date).format("YYYY-MM-DD")).isBefore(
      moment().format("YYYY-MM-DD"),
      "day"
    ),
  completed: (form) => form.fulfilled,
  overdue: (form) =>
    !form.fulfilled &&
    moment(moment(form.date).format("YYYY-MM-DD")).isBefore(
      moment().format("YYYY-MM-DD"),
      "day"
    ),
};

const OwnerAppointmentDashboard = (props) => {
  return (
    <Dashboard
      id="owner_appointments"
      keyFunc={(form) => form.form_id}
      name="My Appointments"
      accountType="owner"
      dataComponent={<AppointmentInfo />}
      newRecordForm={<NewAppointmentForm />}
      newRecordButtonLabel="Make an Appointment"
      noRecordLabel="No appointments found"
      categories={categories}
      getData={async ({ id }) => {
        const response = await makeApiPostRequest(
          "/api/account/owner/getAppointments",
          {
            id,
          }
        );

        return formatAppointmentsResponse(response);
      }}
      {...props}
    />
  );
};

const AdminAppointmentDashboard = (props) => {
  return (
    <Dashboard
      id="admin_appointments"
      keyFunc={(form) => form.form_id}
      name="Appointments"
      accountType="admin"
      dataComponent={<AppointmentInfo showOwner={true} showEdit={false} />}
      noRecordLabel="No appointments found"
      categories={categories}
      getData={async () => {
        const response = await makeApiPostRequest("/api/appointment/getAll");

        return formatAppointmentsResponse(response);
      }}
      {...props}
    />
  );
};

const VeterinarianAppointmentDashboard = (props) => {
  return (
    <Dashboard
      id="veterinarian_appointments"
      keyFunc={(form) => form.form_id}
      name="Appointments"
      accountType="veterinarian"
      dataComponent={
        <AppointmentInfo
          showOwner={true}
          showEdit={false}
          showDelete={false}
          showFillUp={true}
        />
      }
      categories={categories}
      noRecordLabel="No appointments found"
      getData={async () => {
        const response = await makeApiPostRequest("/api/appointment/getAll");

        return formatAppointmentsResponse(response);
      }}
      {...props}
    />
  );
};

const GetAppointmentDashboard = (type) => {
  switch (type) {
    case "admin":
      return AdminAppointmentDashboard;
    case "veterinarian":
      return VeterinarianAppointmentDashboard;
    case "owner":
      return OwnerAppointmentDashboard;
    default:
      return OwnerAppointmentDashboard;
  }
};

export default function AppointmentDashboard({ accountType, ...props }) {
  const { account } = useContext(AccountContext);

  return account ? (
    React.createElement(GetAppointmentDashboard(account.account_type), props)
  ) : (
    <LoadingDial />
  );
}
