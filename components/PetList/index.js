import DeleteIcon from "@components/icons/DeleteIcon";
import EditIcon from "@components/icons/EditIcon";
import Icon from "@components/icons/Icon";
import Masonry from "@components/Masonry";
import FormModal from "@components/Modal/FormModal";
import EditPetForm from "@components/PetForm/EditPetForm";
import { useState } from "react";
import { makeApiPostRequest, makeProperty } from "utility";

function PetInfo({ pet: _pet, onDelete = () => {} }) {
  const [pet, setPet] = useState(_pet);

  return (
    <div className="break-inside card card-compact bg-base-100 shadow-xl">
      <div className="card-body">
        <div>
          <h2 className="card-title text-ellipsis font-bold truncate">
            {pet.name}
          </h2>
          {makeProperty("birthdate", pet)}
          {makeProperty("sex", pet)}
          {makeProperty("breed", pet)}
          {makeProperty("species", pet)}
          {makeProperty("description", pet)}
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
            className="btn btn-error btn-sm drop-shadow"
            onClick={async () => {
              const response = await makeApiPostRequest("/api/pet/delete", {
                id: pet.id,
              });

              if (response.status === 200 && response.data.status === "OK") {
                onDelete(pet);
              }
            }}
          >
            <Icon icon={<DeleteIcon />} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PetList({ pets = [], onDelete = () => {} }) {
  return (
    <>
      <div className="hidden">
        <div className="flex sm:flex lg:flex xl:flex"></div>
        <div className="hidden sm:hidden lg:hidden xl:hidden"></div>
      </div>
      <Masonry>
        {pets.map((pet, index) => (
          <PetInfo
            key={pet.id}
            pet={{ ...pet, index: index + 1 }}
            onDelete={onDelete}
          />
        ))}
      </Masonry>
    </>
    // <div className="overflow-x-auto my-20">
    //   <table className="table w-full">
    //     <thead>
    //       <tr>
    //         <th></th>
    //         <th>Name</th>
    //         <th>Birthdate</th>
    //         <th>Sex</th>
    //         <th>Breed</th>
    //         <th>Species</th>
    //         <th>Description</th>
    //         <th></th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {pets.map((pet, index) => (
    //         <PetInfo key={pet.id} pet={{ ...pet, index: index + 1 }} />
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
  );
}
