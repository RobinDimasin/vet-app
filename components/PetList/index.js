import moment from "moment";

function PetInfo({ pet }) {
  return (
    <tr>
      <th>{pet.index}</th>
      <td>{pet.name}</td>
      <td>{moment(pet.birthdate).format("MMMM Do YYYY")}</td>
      <td>{pet.sex}</td>
      <td>{pet.breed}</td>
      <td>{pet.species}</td>
      <td>{pet.description}</td>
      <th className="space-x-2">
        <button className="btn btn-success btn-xs">Edit</button>
        <button
          className="btn btn-error btn-xs"
          onClick={() => {
            makeApiPostRequest("/api/entity/pet/delete", {
              id: pet.id,
            });
          }}
        >
          Delete
        </button>
      </th>
    </tr>
  );
}

export default function PetList({ pets = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Birthdate</th>
            <th>Sex</th>
            <th>Breed</th>
            <th>Species</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet, index) => (
            <PetInfo key={pet.id} pet={{ ...pet, index: index + 1 }} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
