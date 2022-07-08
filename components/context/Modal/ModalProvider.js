import React, { useState } from "react";
import ModalContext from "./ModalContext";
import { v4 as uuidv4 } from "uuid";

export default function ModalProvider({ children }) {
  const [modals, setModals] = useState({});

  return (
    <ModalContext.Provider
      value={{
        newModal: ({
          content,
          trigger,
          triggerClassname = "btn btn-primary",
        }) => {
          const id = uuidv4();
          setModals((modals) => ({ ...modals, [id]: content }));

          return (
            <label htmlFor={id} className={triggerClassname}>
              {trigger}
            </label>
          );
        },
        deleteModal: (id) => {
          delete modals[id];

          return modals;
        },
      }}
    >
      {children}
      {Object.entries(modals).map(([id, modal]) => {
        return (
          <React.Fragment key={id}>
            <input type="checkbox" id={id} className="modal-toggle" />
            <label htmlFor={id} className="modal cursor-pointer">
              <label className="modal-box relative" htmlFor="">
                <label
                  htmlFor={id}
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                  ✕
                </label>
                {modal}
              </label>
            </label>
          </React.Fragment>
        );
      })}
    </ModalContext.Provider>
  );
}
