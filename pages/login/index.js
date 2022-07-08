import LoginForm from "@components/LoginForm";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const { type } = router.query;

  return (
    <div className="from-primary to-base-100 bg-gradient-to-r">
      <div className="hero min-h-screen bg-transparent ">
        <div className="hero-content flex-col lg:flex-row-reverse md:px-[10%]">
          <div className="card w-96 bg-base-100 shadow-xl">
            <LoginForm accountType={type} />
          </div>
        </div>
      </div>
    </div>
  );
}
