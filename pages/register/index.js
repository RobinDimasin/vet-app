import RegisterForm from "@components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="hero">
      <div className="hero-content flex-col lg:flex-row-reverse md:px-[10%]">
        <div className="card w-[32rem] bg-base-100 shadow-xl">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
