"use client";

import { Modal as MantineModal, Text, Title } from "@mantine/core";
import { useEffect } from "react";

export default function Modal({
  opened,
  title,
  onClose,
  size,
  children,
  playSound,
}) {
  if (playSound == undefined) playSound = true;
  useEffect(() => {
    if (opened && playSound) {
      const audio = new Audio("/audio/popup.mp3");
      audio.play();
    }
  }, [opened]);

  return (
    <MantineModal
      transitionProps={{
        transition: "slide-up",
        duration: 400,
      }}
      opened={opened}
      title={<Title order={3}>{title}</Title>}
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
