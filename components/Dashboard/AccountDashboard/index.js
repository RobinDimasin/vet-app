import useAccount from "@components/hooks/useAccount";
import DeleteIcon from "@components/icons/DeleteIcon";
import EditIcon from "@components/icons/EditIcon";
import Icon from "@components/icons/Icon";
import FormModal from "@components/Modal/FormModal";
import EditReasonForm from "@components/Form/ReasonForm/EditReasonForm";
import React, { useEffect, useState } from "react";
import { makeApiPostRequest, makeProperty } from "utility";
import Dashboard from "..";
import moment from "moment";
import InfoIcon from "@components/icons/InfoIcon";
import Modal from "@components/Modal";
import { useQuery } from "react-query";

export function AccountMoreInfo({ account, doFetch = false }) {
  const excludedProperties = [
    "id",
    "account_id",
    "account_type",
    "email",
    "username",
  ];
  const { data: moreInfo = account } = useQuery(
    doFetch && account.id,
    async () => {
      const response = await makeApiPostRequest(
        "/api/account/getAccountDetailsOf",
        {
          id: account.id,
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
    <>
      <div>
        <h2 className="card-title text-ellipsis font-bold">
          <span>{moreInfo.username ?? account.username}</span>
          <span className="badge badge-sm">
            {account.account_type.toUpperCase()}
          </span>
        </h2>
        {makeProperty("email", moreInfo ?? account)}
        {makeProperty("created_at", moreInfo ?? account)}
        {Object.keys(moreInfo ?? {})
          .filter((key) => !excludedProperties.includes(key))
          .map((key) => {
            return (
              <React.Fragment key={key}>
                {makeProperty(key, moreInfo)}
              </React.Fragment>
            );
          })}
      </div>
    </>
  );
}

function AccountInfo({ data: _account, onDelete = () => {} }) {
  const [account, setAccount] = useState(_account);
  const [deleting, setDeleting] = useState(false);
  const [deletionConfirming, setDeletionConfirming] = useState(false);
  const [doFetch, setDoFetch] = useState(false);

  return (
    <>
      <div>
        <h2 className="card-title text-ellipsis font-bold truncate">
          <span>{account.username}</span>
          <span className="badge badge-sm">
            {account.account_type.toUpperCase()}
          </span>
        </h2>
        {makeProperty("email", account)}
        {makeProperty("created_at", account)}
      </div>
      <div className="grid grid-cols-2 gap-4 drop-shadow">
        <Modal
          trigger={
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setDoFetch(true)}
            >
              <Icon icon={<InfoIcon />} />
              More Info
            </button>
          }
        >
          <AccountMoreInfo account={account} doFetch={doFetch} />
        </Modal>
        <button
          className={`btn btn-error btn-sm drop-shadow ${
            deleting ? "loading btn-disabled" : ""
          }`}
          onClick={async () => {
            if (deletionConfirming) {
              setDeleting(true);
              const response = await makeApiPostRequest("/api/account/delete", {
                id: account.id,
              });

              if (response.status === 200 && response.data.status === "OK") {
                onDelete(account);
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

export default function AccountDashboard({ ...props }) {
  return (
    <Dashboard
      id="accounts"
      name="Accounts"
      accountType="admin"
      dataComponent={<AccountInfo />}
      noRecordLabel="No accounts found"
      categories={{
        owner: (account) => account.account_type === "owner",
        veterinarian: (account) => account.account_type === "veterinarian",
        admin: (account) => account.account_type === "admin",
      }}
      getData={async () => {
        const response = await makeApiPostRequest(
          "/api/account/getAll?type=owner&type=veterinarian&type=admin"
        );

        if (response.status === 200 && response.data.status === "OK") {
          const accounts = response.data.data;
          return accounts;
        }

        return [];
      }}
      {...props}
    />
  );
}
