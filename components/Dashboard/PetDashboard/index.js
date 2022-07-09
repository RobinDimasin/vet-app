import DeleteIcon from "@components/icons/DeleteIcon";
import EditIcon from "@components/icons/EditIcon";
import Icon from "@components/icons/Icon";
import FormModal from "@components/Modal/FormModal";
import EditPetForm from "@components/PetForm/EditPetForm";
import NewPetForm from "@components/PetForm/NewPetForm";
import moment from "moment";
import { useState } from "react";
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

function PetInfo({ data: _pet, onDelete = () => {} }) {
  const [pet, setPet] = useState(_pet);
  const [deleting, setDeleting] = useState(false);
  const [deletionConfirming, setDeletionConfirming] = useState(false);

  return (
    <div className="break-inside card card-compact bg-base-100 shadow-xl">
      <div className="card-body">
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
        </div>
        <div className="grid grid-cols-2 gap-4 drop-shadow">
          <FormModal
            trigger={
              <button className="btn btn-success btn-sm">
                <Icon icon={<EditIcon />} />
                Edit
              </button>
            }
            form={<EditPetForm id={pet.id} values={pet} />}
            onSuccess={(pet) => {
              setPet(pet);
            }}
          />
          <button
            className={`btn btn-error btn-sm drop-shadow ${
              deleting ? "loading btn-disabled" : ""
            }`}
            onClick={async () => {
              if (deletionConfirming) {
                setDeleting(true);
                const response = await makeApiPostRequest("/api/pet/delete", {
                  id: pet.id,
                });

                if (response.status === 200 && response.data.status === "OK") {
                  onDelete(pet);
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

export default function PetDashboard({ accountType, ...props }) {
  return (
    <Dashboard
      id="pets"
      name="Pets"
      accountType={accountType}
      dataComponent={<PetInfo />}
      newRecordForm={<NewPetForm />}
      newRecordButtonLabel="Create New Pet Profile"
      noRecordLabel="No pets found"
      getData={async ({ id }) => {
        const response = await makeApiPostRequest(
          "/api/account/owner/getPets",
          {
            id,
          }
        );

        if (response.status === 200 && response.data.status === "OK") {
          return response.data.data;
        }

        return [];
      }}
      {...props}
    />
  );
}
