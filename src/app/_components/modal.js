"use client";

import { Modal as MantineModal } from "@mantine/core";

export default function Modal({ opened, title, onClose, size, children }) {
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
