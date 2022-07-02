import useAccount from "@components/hooks/useAccount";
import PetForm from "@components/PetForm";
import PetList from "@components/PetList";
import { useEffect, useState } from "react";
import { makeApiPostRequest } from "utility";

export default function Appointment() {
  const { account, loading } = useAccount({ type: "owner" });
  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (account && account.id) {
      makeApiPostRequest("/api/account/owner/getPets", {
        id: account.id,
      })
        .then((response) => {
          if (response.status === 200 && response.data.status === "OK") {
            setPets(response.data.data);
          }
        })
        .catch(() => {});
    }
  }, [account]);

  return (
    <div className="from-primary to-base-100 bg-gradient-to-r">
      <div className="hero min-h-screen bg-transparent">
        <div className="hero-content flex-col lg:flex-row-reverse md:px-[10%]">
          {loading ? (
            <div
              className="radial-progress animate-spin"
              style={{
                "--value": 20,
              }}
            ></div>
          ) : (
            <PetList pets={pets} />
          )}
        </div>
      </div>
    </div>
  );
}
