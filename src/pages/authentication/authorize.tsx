import { useForm } from '@mantine/form';
import {
  Text,
  Paper,
  Button,
  Divider,
  Flex,
  LoadingOverlay,
  List,
  ThemeIcon,
  Center,
} from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '@/lib/oidc';
import { IconCircleCheck } from '@tabler/icons-react';

export async function getServerSideProps({ query }: { query: { [key: string]: string } }) {
  if (!query["interaction"]) {
    let oidc = await client();
    let url = oidc.authorizationUrl("login openid email");
    return {
      redirect: {
        destination: url,
        permanent: false,
      }
    }
  }
  const interactionDetails = await fetch(`http://${process.env.URL}/oidc/interaction/${query["interaction"]}`);
  const interactionJson = await interactionDetails.json();
  console.log(interactionJson);
  const clientDetails = await fetch(`http://${process.env.URL}/oidc/client/${interactionJson.params.client_id}`);
  const clientJson = await clientDetails.json();
  console.log(clientJson)
  console.log("READY")
  return {
    props: {
      interaction: query["interaction"] ? query["interaction"] : null,
      interactionDetails: interactionJson,
      clientDetails: clientJson
    }
  }
}

export default function Authentication({ interaction, interactionDetails, clientDetails }: { interaction: string, interactionDetails: any, clientDetails: any }) {
  const [authorizing, setAuthorizing] = useState(false);
  function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  const [wallpaper, setWallpaper] = useState(randomIntFromInterval(1, 10))
  const form = useForm({

  });
  const router = useRouter();
  return (
    <Flex style={{ minHeight: "100vh", backgroundImage: `url(/images/login/login${wallpaper}.jpg)`, backgroundPosition: "center", backgroundSize: "cover" }}>
      <Paper my="auto" mx="auto" radius="md" p="xl" sx={{ minWidth: "20vw" }} withBorder >
        <LoadingOverlay visible={!interaction} overlayBlur={2} />
        <Center>
          <img width={70} src={clientDetails.logoUri} />
        </Center>
        <Text ta="center" size="lg" mt="sm" weight={500}>
          Welcome back{interactionDetails.lastSubmission ? ", " + interactionDetails.lastSubmission.login.firstName : ""}!
        </Text>

        <form id="leForm" action={`/oidc/interaction/${interaction}/confirm`} method="post" onSubmit={form.onSubmit(async ({ email, password }) => {
          setAuthorizing(true)
          const audio = new Audio("/audio/logon.wav");
          await audio.play();
          (document.getElementById("leForm") as HTMLFormElement).submit();
        })}>
          <Divider my="md" />
          <Text ta="center" size="sm">{clientDetails.clientName} wants to</Text>
          <List mt="sm" spacing="xs" size="md" center icon={<ThemeIcon color="teal" size={24} radius="xl">
            <IconCircleCheck size="1rem" />
          </ThemeIcon>}>
            <List.Item>View basic profile information</List.Item>
            <List.Item>View your email address</List.Item>
          </List>

          <Flex>
            <Button color="red" onClick={() => window.close()} radius="md" mt="xl" mr={5} fullWidth disabled={authorizing}>
              Block
            </Button>
            <Button color="green" type="submit" radius="md" mt="xl" ml={5} fullWidth loading={authorizing}>
              Allow
            </Button>
          </Flex>
        </form>
      </Paper>
    </Flex>
  );
}