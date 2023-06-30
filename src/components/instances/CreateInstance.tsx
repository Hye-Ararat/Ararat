import { Button, Modal, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";

export default function CreateInstance() {
    const [createInstance, setCreatingInstance] = useState(false);
    const [audio, setAudio] = useState(null);
    const theme = useMantineTheme();
    useEffect(() => {
        if (createInstance) {
            let aud = new Audio("/audio/create.mp3")
            aud.volume = 0.60;
            aud.play()
            aud.loop = true;
            setAudio(aud);
        } else {
            if (audio) {
            audio.pause();
            audio.currentTime = 0;
            }
        }
    }, [createInstance])
    return (
        <>
        <Button my="auto" onClick={() => setCreatingInstance(true)} sx={{marginLeft: "auto"}}>Create Instance</Button>
        <Modal overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }} opened={createInstance} onClose={() => setCreatingInstance(false)} title="Create Instance" centered>
        <p>test</p>
        </Modal>
        </>
    )
}