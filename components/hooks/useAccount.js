import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getBaseURL, makeApiPostRequest } from "utility";
import { useRouter } from "next/router";
import AccountContext from "@components/context/Account/AccountContext";

export default function useAccount({ type } = {}) {
  const [loading, setLoading] = useState(true);

  const { account, setAccount, logout } = useContext(AccountContext);
  const router = useRouter();

  const destination = useMemo(
    () => router.pathname + "?" + new URLSearchParams(router.query).toString(),
    [router]
  );

  useEffect(() => {
    const redirectToLogin = () => {
      router.push(`/login?type=${type}&destination=${destination}`);
    };

    // setLoading(true);

    // makeApiPostRequest("/api/account/getAccountDetails")
    //   .then((response) => {
    //     if (
    //       response.status === 200 &&
    //       response.data.status === "OK" &&
    //       (!type || response.data.data.account_type === type)
    //     ) {
    //       setAccount(response.data.data);
    //     } else {
    //       if (type) {
    //         redirectToLogin();
    //       }
    //     }
    //   })
    //   .catch((e) => {
    //     if (type) {
    //       redirectToLogin();
    //     }
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
    setLoading(false);
  }, [type, setAccount, destination, router]);

  return { account, logout, loading };
}
