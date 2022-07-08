import { createContext } from "react";

const ModalContext = createContext({
  newModal: ({ content, trigger, triggerClassname = "btn btn-primary" }) => {},
  deleteModal: (id) => {},
});

export default ModalContext;
