import { useContext, useEffect, useMemo } from "react";
import { makeApiPostRequest } from "utility";
import { useRouter } from "next/router";
import AccountContext from "@components/context/Account/AccountContext";
import { useQuery } from "react-query";

export default function useAccount({ type = "owner" } = {}) {
  const { account, setAccount, logout } = useContext(AccountContext);
  const router = useRouter();

  const destination = useMemo(() => router.pathname, [router]);

  const {
    data: accountDetails,
    isLoading,
    isSuccess,
  } = useQuery("fetch_account_details", async () => {
    try {
      const response = await makeApiPostRequest(
        "/api/account/getAccountDetails"
      );

      if (
        response.status === 200 &&
        response.data.status === "OK" &&
        response.data.data.account_type === type
      ) {
        return response.data.data;
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    if (type) {
      if (isSuccess) {
        if (accountDetails) {
          setAccount(accountDetails);
        } else {
          router.push(`/login?type=${type}&destination=${destination}`);
        }
      }
    }
  }, [accountDetails, isSuccess, setAccount, type, destination, router]);

  return { account, logout, loading: isLoading };
}
