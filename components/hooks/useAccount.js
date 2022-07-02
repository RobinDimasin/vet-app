import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getBaseURL, makeApiPostRequest } from "utility";
import { useRouter } from "next/router";
import AccountContext from "@components/context/Account/AccountContext";

export default function useAccount({ type = "owner" } = {}) {
  const [loading, setLoading] = useState(true);

  const { account, setAccount, logout } = useContext(AccountContext);
  const router = useRouter();

  const destination = useMemo(() => router.pathname, [router]);

  useEffect(() => {
    const redirectToLogin = () => {
      router.push(`/login?type=${type}&destination=${destination}`);
    };

    setLoading(true);

    if (type) {
      makeApiPostRequest("/api/account/getAccountDetails")
        .then((response) => {
          if (
            response.status === 200 &&
            response.data.status === "OK" &&
            response.data.data.account_type === type
          ) {
            setAccount(response.data.data);
          } else {
            redirectToLogin();
          }
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
          redirectToLogin();
          setLoading(false);
        });
    }
  }, [type, setAccount, destination, router]);

  return { account, logout, loading };
}
