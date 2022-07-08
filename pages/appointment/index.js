import AppointmentForm from "@components/AppointmentForm";
import useAccount from "@components/hooks/useAccount";
import { useEffect, useState } from "react";
import { makeApiPostRequest } from "utility";

export default function Appointment() {
  const { account, loading } = useAccount({ type: "owner" });

  const [pets, setPets] = useState();
  const [reasons, setReasons] = useState();

  useEffect(() => {
    makeApiPostRequest("/api/entity/reason/getAll")
      .then((response) => {
        if (response.status === 200 && response.data.status === "OK") {
          setReasons(response.data.data);
        }
      })
      .catch(() => setReasons([]));
  }, []);

  useEffect(() => {
    if (account && account.account_type === "owner" && account.id) {
      makeApiPostRequest("/api/account/owner/getPets", {
        id: account.id,
      })
        .then((response) => {
          if (response.status === 200 && response.data.status === "OK") {
            setPets(response.data.data);
          }
        })
        .catch(() => setPets([]));
    }
  }, [account]);

  return (
    <div className="from-primary to-base-100 bg-gradient-to-r">
      <div className="hero min-h-screen bg-transparent ">
        <div className="hero-content flex-col lg:flex-row-reverse md:px-[10%]">
          {loading || !reasons || !pets ? (
            <div
              className="radial-progress animate-spin"
              style={{
                "--value": 20,
              }}
            ></div>
          ) : (
            <div className="card w-[32rem] bg-base-100 shadow-xl">
              <AppointmentForm pets={pets} reasons={reasons} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
