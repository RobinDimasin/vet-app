import AccountContext from "@components/context/Account/AccountContext";
import useAccount from "@components/hooks/useAccount";
import DeleteIcon from "@components/icons/DeleteIcon";
import EditIcon from "@components/icons/EditIcon";
import Icon from "@components/icons/Icon";
import LinkIcon from "@components/icons/LinkIcon";
import Modal from "@components/Modal";
import FormModal from "@components/Modal/FormModal";
import EditPetForm from "@components/PetForm/EditPetForm";
import NewPetForm from "@components/PetForm/NewPetForm";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { LoadingDial, makeApiPostRequest, makeProperty } from "utility";
import Dashboard from "..";
import { AccountMoreInfo } from "../AccountDashboard";

function PetInfo({
  data: _pet,
  showOwner = false,
  onDelete = () => {},
  showEdit = true,
  showDelete = true,
}) {
  const [pet, setPet] = useState(_pet);
  const [deleting, setDeleting] = useState(false);
  const [deletionConfirming, setDeletionConfirming] = useState(false);

  const { data: owner } = useQuery(showOwner && pet.owner_id, async () => {
    const response = await makeApiPostRequest(
      "/api/account/getAccountDetailsOf",
      {
        id: pet.owner_id,
        type: "owner",
      }
    );

    if (response.status === 200 && response.data.status === "OK") {
      return response.data.data;
    } else {
      throw new Error("Invalid credentials");
    }
  });

  return (
    <>
      <div>
        <h2 className="card-title text-ellipsis font-bold">{pet.name}</h2>
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
        {makeProperty("birthdate", pet)}
        {makeProperty("sex", pet)}
        {makeProperty("breed", pet)}
        {makeProperty("species", pet)}
        {makeProperty("description", pet)}
      </div>
      <div
        className={`grid grid-cols-${showDelete + showEdit} gap-4 drop-shadow`}
      >
        {showEdit && (
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
        )}
        {showDelete && (
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
        )}
      </div>
    </>
  );
}

const AdminPetDashboard = (props) => {
  return (
    <Dashboard
      id="pets"
      name="Pets"
      accountType="admin"
      dataComponent={<PetInfo showOwner={true} />}
      noRecordLabel="No pets found"
      getData={async () => {
        const response = await makeApiPostRequest("/api/pet/getAll");

        if (response.status === 200 && response.data.status === "OK") {
          return response.data.data;
        }

        return [];
      }}
      {...props}
    />
  );
};

const VeterinarianPetDashboard = (props) => {
  return (
    <Dashboard
      id="pets"
      name="Pets"
      accountType="veterinarian"
      dataComponent={
        <PetInfo showOwner={true} showDelete={false} showEdit={false} />
      }
      noRecordLabel="No pets found"
      getData={async () => {
        const response = await makeApiPostRequest("/api/pet/getAll");

        if (response.status === 200 && response.data.status === "OK") {
          return response.data.data;
        }

        return [];
      }}
      {...props}
    />
  );
};

const OwnerPetDashboard = (props) => {
  return (
    <Dashboard
      id="pets"
      name="Pets"
      accountType="owner"
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
};

const GetPetDashboard = (type) => {
  switch (type) {
    case "admin":
      return AdminPetDashboard;
    case "veterinarian":
      return VeterinarianPetDashboard;
    case "owner":
      return OwnerPetDashboard;
    default:
      return OwnerPetDashboard;
  }
};

export default function PetDashboard(props) {
  const { account } = useContext(AccountContext);

  return React.createElement(
    GetPetDashboard(account ? account.account_type : null),
    props
  );
}
