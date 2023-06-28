import { AppProps } from 'next/app';
import Head from 'next/head';
import { Header, MantineProvider, Navbar } from '@mantine/core';
import AppShell from '../components/AppShell';
import { RouterTransition } from '@/components/RouteTransition';
import {useColorScheme} from "@mantine/hooks";
import { useRouter } from 'next/router';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const colorScheme = useColorScheme("dark");
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Hye Ararat</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: colorScheme,
        }}
      >
        <RouterTransition />
        {!router.pathname.startsWith("/authentication") ?
        <AppShell>
    <Component {...pageProps} />
    </AppShell>
    : <Component {...pageProps} />}
      </MantineProvider>
    </>
  );
}