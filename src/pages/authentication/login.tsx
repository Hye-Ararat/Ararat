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
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { client } from '@/lib/oidc';

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
    const [loggingIn, setLoggingIn] = useState(false);
  function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  const [wallpaper, setWallpaper]= useState(randomIntFromInterval(1, 10))
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });
  const router = useRouter();
  return (
    <Flex style={{minHeight: "100vh", backgroundImage: `url(/images/login/login${wallpaper}.jpg)`, backgroundPosition: "center", backgroundSize: "cover"}}>
    <Paper my="auto" mx="auto" radius="md" p="xl" sx={{minWidth: "20vw"}} withBorder >
    <LoadingOverlay visible={!interaction} overlayBlur={2} />
      <Text ta="center" size="lg" weight={500}>
        Welcome to Hye Ararat!
      </Text>
      <Divider label="Please login to continue" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(async ({email, password}) => {
        setLoggingIn(true)
        let res = await fetch(`/oidc/interaction/${interaction}/login`, {
            method: "POST",
            body: JSON.stringify({
                login: email,
                password
            }),
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-cache"
        });
        router.replace(res.url);
      })}>
        <Stack>

          <TextInput
            required
            label="Email"
            placeholder="hello@hye.gg"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
        </Stack>


          <Button type="submit" radius="md" mt="xl" fullWidth loading={loggingIn}>
            Login
          </Button>
      </form>
    </Paper>
    </Flex>
  );
}