import DeleteIcon from "@components/icons/DeleteIcon";
import EditIcon from "@components/icons/EditIcon";
import Icon from "@components/icons/Icon";
import FormModal from "@components/Modal/FormModal";
import EditReasonForm from "@components/Form/ReasonForm/EditReasonForm";
import NewReasonForm from "@components/Form/ReasonForm/NewReasonForm";
import NewReviewForm from "@components/Form/ReviewForm/NewReasonForm";
import Image from "next/image";
import { useState } from "react";
import { useQuery } from "react-query";
import { makeApiPostRequest, makeName } from "utility";
import Dashboard from "..";

function ReviewInfo({ data: _review, onDelete = () => {} }) {
  const [review, setReview] = useState(_review);
  const [deleting, setDeleting] = useState(false);
  const [deletionConfirming, setDeletionConfirming] = useState(false);
  const colors = [
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-lime-400",
    "bg-green-400",
  ];

  const { data: owner, isLoading: isOwnerLoading } = useQuery(
    review.owner_id,
    async () => {
      const response = await makeApiPostRequest(
        "/api/account/getAccountDetailsOf",
        {
          id: review.owner_id,
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
    <>
      <div className="avatar justify-center mt-5">
        <div className="w-24 rounded-full relative">
          {owner && owner.profile_picture_url ? (
            <img
              src={owner.profile_picture_url}
              layout="fill"
              objectFit="cover"
              alt={owner ? makeName(owner) : ""}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="card-body items-center">
        <h2 className="card-title text-center">
          {owner ? makeName(owner) : ""}
        </h2>

        <div className="rating gap-1 justify-center">
          {colors.map((color, index) => {
            return (
              <input
                type="radio"
                key={index}
                className={`mask mask-heart ${color}`}
                checked={review.rating <= index + 1}
                disabled
              />
            );
          })}
          <p>({review.rating})</p>
        </div>
        <p></p>
        <p className="items-center text-center">{review.comment}</p>
      </div>
    </>
  );
}

export default function ReviewDashboard({ accountType, ...props }) {
  return (
    <Dashboard
      id="reviews"
      name="Reviews"
      accountType={null}
      dataComponent={<ReviewInfo />}
      newRecordForm={<NewReviewForm />}
      newRecordButtonLabel="Create Review"
      noRecordLabel="No reviews found"
      getData={async () => {
        const response = await makeApiPostRequest("/api/review/getAll");

        if (response.status === 200 && response.data.status === "OK") {
          return response.data.data;
        }

        return [];
      }}
      categories={{
        all: (data) => true,
        "(5)": (data) => data.rating === 5,
        "(4)": (data) => data.rating === 4,
        "(3)": (data) => data.rating === 3,
        "(2)": (data) => data.rating === 2,
        "(1)": (data) => data.rating === 1,
      }}
      breaks={[
        ["default", 1],
        ["sm", 2],
        ["lg", 3],
      ]}
      footer={
        <div className="card card-compact bg-base-200 shadow-xl rounded-b-none">
          <div className="card-body">
            <div className="flex justify-center">
              <div className="rating gap-1  ">
                <input
                  type="radio"
                  name="rating-0"
                  className="mask mask-heart bg-red-400"
                />
                <input
                  type="radio"
                  name="rating-0"
                  className="mask mask-heart bg-orange-400"
                />
                <input
                  type="radio"
                  name="rating-0"
                  className="mask mask-heart bg-yellow-400"
                />
                <input
                  type="radio"
                  name="rating-0"
                  className="mask mask-heart bg-lime-400"
                />
                <input
                  type="radio"
                  name="rating-0"
                  className="mask mask-heart bg-green-400"
                  checked
                />
              </div>
            </div>
          </div>
        </div>
      }
      {...props}
    />
  );
}
