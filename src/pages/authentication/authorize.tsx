import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  PaperProps,
  Button,
  Divider,
  Stack,
  Flex,
  LoadingOverlay,
  List,
  ThemeIcon,
  Center,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '@/lib/oidc';
import { IconCircleCheck } from '@tabler/icons-react';
import Image from 'next/image';

export async function getServerSideProps({query}) {
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
    return {props: {
        interaction: query["interaction"] ? query["interaction"] : null
    }}
}

export default function Authentication({interaction}: {interaction: string}) {
    const [authorizing, setAuthorizing] = useState(false);
  function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  const [wallpaper, setWallpaper]= useState(randomIntFromInterval(1, 10))
  const form = useForm({
    
  });
  const router = useRouter();
  return (
    <Flex style={{minHeight: "100vh", backgroundImage: `url(/images/login/login${wallpaper}.jpg)`, backgroundPosition: "center", backgroundSize: "cover"}}>
    <Paper my="auto" mx="auto" radius="md" p="xl" sx={{minWidth: "20vw"}} withBorder >
    <LoadingOverlay visible={!interaction} overlayBlur={2} />
    <Center>
        <img width={70} src="https://linuxcontainers.org/lxd/docs/latest/_images/containers.png" />
        </Center>
      <Text ta="center" size="lg" mt="sm" weight={500}>
        Welcome back, Joseph!
      </Text>

      <form id="leForm" action={`/oidc/interaction/${interaction}/confirm`} method="post" onSubmit={form.onSubmit(async ({email, password}) => {
        setAuthorizing(true)
        const audio = new Audio("/audio/logon.wav");
        await audio.play();
        document.getElementById("leForm").submit();
      })}>
        <Divider my="md" />
        <Text ta="center" size="sm">Hye Ararat wants to</Text>
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