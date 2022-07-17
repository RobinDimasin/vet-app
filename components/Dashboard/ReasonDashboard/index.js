import DeleteIcon from "@components/icons/DeleteIcon";
import EditIcon from "@components/icons/EditIcon";
import Icon from "@components/icons/Icon";
import FormModal from "@components/Modal/FormModal";
import EditReasonForm from "@components/Form/ReasonForm/EditReasonForm";
import NewReasonForm from "@components/Form/ReasonForm/NewReasonForm";
import { useState } from "react";
import { makeApiPostRequest } from "utility";
import Dashboard from "..";

function ReasonInfo({ data: _reason, onDelete = () => {} }) {
  const [reason, setReason] = useState(_reason);
  const [deleting, setDeleting] = useState(false);
  const [deletionConfirming, setDeletionConfirming] = useState(false);

  return (
    <>
      <div>
        <h2 className="card-title text-ellipsis font-bold">{reason.id}</h2>
        {reason.reason}
      </div>
      <div className="grid grid-cols-2 gap-4 drop-shadow">
        <FormModal
          trigger={
            <button className="btn btn-success btn-sm">
              <Icon icon={<EditIcon />} />
              Edit
            </button>
          }
          form={<EditReasonForm id={reason.id} values={reason} />}
          onSuccess={(reason) => {
            setReason(reason);
          }}
        />
        <button
          className={`btn btn-error btn-sm drop-shadow ${
            deleting ? "loading btn-disabled" : ""
          }`}
          onClick={async () => {
            if (deletionConfirming) {
              setDeleting(true);
              const response = await makeApiPostRequest("/api/reason/delete", {
                id: reason.id,
              });

              if (response.status === 200 && response.data.status === "OK") {
                onDelete(reason);
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
    </>
  );
}

export default function ReasonDashboard({ accountType, ...props }) {
  return (
    <Dashboard
      id="reasons"
      name="Reasons"
      accountType="admin"
      dataComponent={<ReasonInfo />}
      newRecordForm={<NewReasonForm />}
      newRecordButtonLabel="Create New Reason for Appointment"
      noRecordLabel="No reasons found"
      getData={async ({ id }) => {
        const response = await makeApiPostRequest("/api/reason/getAll");

        if (response.status === 200 && response.data.status === "OK") {
          return response.data.data;
        }

        return [];
      }}
      {...props}
    />
  );
}
