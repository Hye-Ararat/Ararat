"use client";

import { Modal as MantineModal, Text, Title, em } from "@mantine/core";
import { useEffect } from "react";
import {useMediaQuery} from "@mantine/hooks"

export default function Modal({
  opened,
  title,
  onClose,
  size,
  children,
  playSound,
}) {
  const isMobile = useMediaQuery(`(max-width: ${em(875)})`);
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
      fullScreen={isMobile}
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
