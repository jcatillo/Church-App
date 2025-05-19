import { IconButton } from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import React from "react";
import { color } from "framer-motion";

export function SimpleModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <IconButton bg='black' color={'white'} onClick={onClose} aria-label="Close modal">
            <IoMdClose />
        </IconButton>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "90%",
    maxWidth: 500,
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
  },
};
