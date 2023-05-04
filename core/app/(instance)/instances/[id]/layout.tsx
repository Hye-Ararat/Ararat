import React from "react";
import Navigation from "../../../../components/instance/Navigation";
import CacheProvider from "../../CacheProvider";

export default function RootLayout({ children, params }: { children:  React.ReactNode, params: {id: string} }) {
    console.log(params)
  return (
    <html>
      <head></head>
      <body>
        <CacheProvider>
        <Navigation id={params.id}>
        {children}
        </Navigation>
        </CacheProvider>
              </body>
    </html>
  );
}