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
} from '@mantine/core';
import { useState } from 'react';

export default function AuthenticationForm(props: PaperProps) {
  function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  const [wallpaper, setWallpaper]= useState(randomIntFromInterval(1, 3))
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

  return (
    <Flex style={{minHeight: "100vh", backgroundImage: `url(/images/login/login${wallpaper}.jpg)`, backgroundPosition: "center"}}>
    <Paper my="auto" mx="auto" radius="md" p="xl" sx={{minWidth: "20vw"}} withBorder {...props} >
      <Text ta="center" size="lg" weight={500}>
        Welcome to Hye Ararat!
      </Text>
      <Divider label="Please login to continue" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
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


          <Button type="submit" radius="md" mt="xl" fullWidth>
            Login
          </Button>
      </form>
    </Paper>
    </Flex>
  );
}