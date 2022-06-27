import LoginForm from "@components/LoginForm";

export default function LoginPage() {
  return (
    <div className="from-primary to-base-100 bg-gradient-to-r">
      <div className="hero min-h-screen bg-transparent ">
        <div className="hero-content flex-col lg:flex-row-reverse md:px-[10%]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
