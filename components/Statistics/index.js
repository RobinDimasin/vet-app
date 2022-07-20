import { makeApiGetRequest } from "utility";
import { useCallback, useEffect } from "react";
import CountUp from "react-countup";
import { useQuery } from "react-query";
export default function Statistics() {
  const { data, isLoading } = useQuery("statistics", async () => {
    return makeApiGetRequest("/api/statistics");
  });

  const makeCount = useCallback(
    (key, duration = 2) => {
      return !isLoading && data ? (
        <CountUp end={data.data[key]} duration={duration} />
      ) : (
        "-"
      );
    },
    [isLoading, data]
  );

  return (
    <>
      <h1 className="text-5xl text-[#2a7a9f] font-bold pb-7">STATISTICS</h1>
      <div className="stats shadow">
        <div className="stat w-[18rem]">
          <div className="stat-title">Pet Owners</div>
          <div className="stat-value text-primary">{makeCount("owner")}</div>
        </div>

        <div className="stat w-[18rem]">
          <div className="stat-title">Pets</div>
          <div className="stat-value text-primary">{makeCount("pet")}</div>
        </div>

        <div className="stat w-[18rem]">
          <div className="stat-title">Veterinarians</div>
          <div className="stat-value text-primary">
            {makeCount("veterinarian")}
          </div>
        </div>

        <div className="stat w-[18rem]">
          <div className="stat-title">Completed Appointments</div>
          <div className="stat-value text-primary">
            {makeCount("completedAppointments")}
          </div>
        </div>
      </div>
    </>
  );
}
