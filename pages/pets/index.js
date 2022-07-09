import PetDashboard from "@components/Dashboard/PetDashboard";
import useAccount from "@components/hooks/useAccount";
import BoxIcon from "@components/icons/BoxIcon";
import Icon from "@components/icons/Icon";
import PlusIcon from "@components/icons/PlusIcon";
import ReactModal from "@components/Modal";
import FormModal from "@components/Modal/FormModal";
import NewPetForm from "@components/PetForm/NewPetForm";
import PetList from "@components/PetList";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { makeApiPostRequest } from "utility";

export default function Pets() {
  return <PetDashboard accountType="owner" name="Your Pets" />;
  // const queryClient = useQueryClient();

  // const { account, loading } = useAccount({ type: "owner" });
  // const [pets, setPets] = useState([]);

  // useEffect(() => {
  //   if (account && account.id) {
  //     makeApiPostRequest("/api/account/owner/getPets", {
  //       id: account.id,
  //     }).then((response) => {
  //       if (response.status === 200 && response.data.status === "OK") {
  //         setPets(response.data.data);
  //       }
  //     });
  //   }
  // }, [account]);

  // return (
  //   <div className="from-primary to-base-100 bg-gradient-to-r">
  //     <div className="hero min-h-screen bg-transparent place-items-start">
  //       <div
  //         className={`hero-content block mx-auto my-20 ${
  //           pets.length === 0 ? "w-full" : "w-full"
  //         }`}
  //       >
  //         {!loading ? (
  //           <>
  //             <div className="card card-compact bg-base-100 shadow-xl mb-4">
  //               <div className="card-body">
  //                 <div className="flex justify-between">
  //                   <h2 className="card-title">Your Pets</h2>
  //                   <div className="card-actions justify-end">
  //                     <FormModal
  //                       trigger={
  //                         <button className="btn btn-primary">
  //                           <Icon icon={<PlusIcon />} />
  //                           <p className="hidden md:block">
  //                             Create New Pet Profile
  //                           </p>
  //                           <p className="block md:hidden">New</p>
  //                         </button>
  //                       }
  //                       form={<NewPetForm />}
  //                       onSuccess={(pet) => {
  //                         setPets([pet, ...pets]);
  //                       }}
  //                     />
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //             {pets.length > 0 ? (
  //               <PetList
  //                 pets={pets}
  //                 onDelete={(pet) =>
  //                   setPets((pets) => pets.filter((p) => p.id !== pet.id))
  //                 }
  //               />
  //             ) : (
  //               <div className="card card-compact bg-base-100 shadow-xl mb-4">
  //                 <div className="card-body">
  //                   <div className="mx-auto">
  //                     <Icon height={12} width={12} icon={<BoxIcon />} />
  //                   </div>
  //                   <p className="mx-auto">No pet found</p>
  //                 </div>
  //               </div>
  //             )}
  //           </>
  //         ) : (
  //           <div
  //             className="radial-progress animate-spin"
  //             style={{
  //               "--value": 20,
  //             }}
  //           ></div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
}
