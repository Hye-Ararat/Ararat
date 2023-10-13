import '@mantine/core/styles.css';
import '@mantine/code-highlight/styles.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import Provider from './_components/SessionProvider';

export const metadata = {
  title: 'Hye Ararat',
  description: `Take your infrastructure to it's peak`,
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme='dark' />
      </head>
      <body>
        <Provider>
          <MantineProvider defaultColorScheme="dark">
            {children}
          </MantineProvider>
        </Provider>
      </body>
    </html>
  );
}