import { Inter, Poppins } from "next/font/google";
import "@mantine/core-app/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  Text,
  Container,
} from "@mantine/core-app";
import ApplicationShell from "./AppShell";
import "../globals.css"

/*const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});*/


export const metadata = {
  title: "Hye Enzonet",
  description: "Hye Enzonet | Server Hosting For Everyone",
};


export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider
          defaultColorScheme="dark"
          theme={{
            colorScheme: "dark",
            fontFamily: "Inter, sans-serif",
            defaultRadius: "md",
            colors: {
              dark: [
                "#fff",
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
          <ApplicationShell>
            {children}
          </ApplicationShell>

        </MantineProvider>
      </body>
    </html>
  );
}
