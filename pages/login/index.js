import LoginForm from "@components/Form/LoginForm";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const { type } = router.query;

  return (
    <div className="hero">
      <div className="hero-content flex-col lg:flex-row-reverse md:px-[10%]">
        <div className="card w-96 bg-base-100 shadow-xl">
          <LoginForm type={type} />
        </div>
      </div>
    </div>
  );
}
