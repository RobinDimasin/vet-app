import useAccount from "@components/hooks/useAccount";

export default function Appointment() {
  const { account, logout, loading } = useAccount({
    type: "owner",
  });

  return (
    <div className="from-primary to-base-100 bg-gradient-to-r">
      <div className="hero min-h-screen bg-transparent ">
        <div className="hero-content flex-col lg:flex-row-reverse md:px-[10%]">
          Appointments Test1
        </div>
      </div>
    </div>
  );
}
