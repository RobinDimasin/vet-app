import { useEffect, useState } from "react";
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

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount: (account) => {
          if (localStorage) {
            localStorage.setItem("account", JSON.stringify(account));
          }
          setAccount(account);
        },
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
