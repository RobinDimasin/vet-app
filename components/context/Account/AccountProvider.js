import axios from "axios";
import { useEffect, useState } from "react";
import { getBaseURL, makeApiPostRequest } from "utility";
import AccountContext from "./AccountContext";

export default function AccountProvider({ children }) {
  const [account, setAccount] = useState();

  useEffect(() => {
    setAccount(
      localStorage.getItem("account")
        ? JSON.parse(localStorage.getItem("account"))
        : null
    );
  }, []);

  useEffect(() => {
    if (account) {
      localStorage.setItem("account", JSON.stringify(account));
    } else {
      localStorage.removeItem("account");
    }
  }, [account]);

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        logout: async () => {
          setAccount(null);
          return (
            (await makeApiPostRequest("/api/account/logout")).status === 200
          );
        },
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
