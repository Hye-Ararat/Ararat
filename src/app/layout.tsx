import { Inter, Poppins } from 'next/font/google'
import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import {Provider} from "./muiComponents"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hye Ararat',
  description: 'Hye Ararat Yergu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
        <Provider>
        {children}
        </Provider>
        </NextAppDirEmotionCacheProvider>
        </body>
    </html>
  )
}
