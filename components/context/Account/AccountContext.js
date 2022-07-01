import { createContext } from "react";

const AccountContext = createContext({
  account: null,
  setAccount: () => {},
  logout: () => {},
});

export default AccountContext;
