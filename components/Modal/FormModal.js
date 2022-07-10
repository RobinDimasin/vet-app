import { THEME } from "@utility/theme";
import React, { useState } from "react";
import ReactModal from "react-modal";

export default function FormModal({
  trigger,
  className,
  form,
  onSuccess = () => {},
  onError = () => {},
}) {
  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <>
      {trigger && React.cloneElement(trigger, { onClick: openModal })}
      <ReactModal
        isOpen={open}
        onRequestClose={closeModal}
        style={{
          content: {
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, 0)",
            border: "none",
            paddingBottom: "40px",
            backgroundColor: "transparent",
          },
        }}
        contentLabel="Example Modal"
      >
        <div data-theme={THEME}>
          <div className={`card bg-base-100 shadow-xl ${className}`}>
            <div className="card-body card-compact">
              <button
                onClick={closeModal}
                className="btn btn-sm btn-ghost btn-circle absolute right-2 top-2"
              >
                ✕
              </button>
              {React.cloneElement(form, {
                onSuccess: async (...args) => {
                  onSuccess(...args);
                  closeModal();
                },
                onError,
              })}
            </div>
          </div>
        </div>
      </ReactModal>
    </>
  );
}
