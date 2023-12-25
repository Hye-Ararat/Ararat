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
import "@/lib/xterm.css"
import { Inter, Poppins } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ['latin']
})

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
          colorScheme: colorScheme,
          fontFamily: inter.style.fontFamily,

          defaultRadius: "md",
          colors: {
            dark: [
              undefined,
              undefined,
              undefined,
              undefined,
              "rgb(38, 44, 52)",
              "rgb(34, 40, 48)",
              "rgb(26, 32, 40)",
              "#0d141d",
              "#080f18",
            ],
          },
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