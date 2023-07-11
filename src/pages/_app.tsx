import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import AppShell from '../components/AppShell';
import { RouterTransition } from '@/components/RouteTransition';
import { useColorScheme } from "@mantine/hooks";
import { useRouter } from 'next/router';
import { SpotlightProvider } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { Notifications } from '@mantine/notifications';


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
        <Notifications position="top-right" />
        <SpotlightProvider searchIcon={<IconSearch size="1.2rem" />} searchPlaceholder='Spotlight (BETA)' nothingFoundMessage="We couldn't find anything that matches your query" shortcut={['mod + P', 'mod + K', '/']} actions={[]}>
          <RouterTransition />
          {!router.pathname.startsWith("/authentication") ?
            <AppShell>
              <Component {...pageProps} />
            </AppShell>
            : <Component {...pageProps} />}
        </SpotlightProvider>
      </MantineProvider>
    </>
  );
}