"use client";

import { Modal as MantineModal } from "@mantine/core";
import { useEffect } from "react";

export default function Modal({ opened, title, onClose, size, children }) {
  useEffect(() => {
    if (opened) {
      const audio = new Audio("/audio/popup.mp3");
      audio.play();
    }
  }, [opened]);

  return (
    <MantineModal
      opened={opened}
      title={title}
      onClose={onClose}
      centered
      size={size}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      {children}
    </MantineModal>
  );
}
