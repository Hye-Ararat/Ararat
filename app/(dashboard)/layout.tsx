import React from "react";
import Navigation from "../../components/navigation"

export default function RootLayout({ children }: { children:  React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        <Navigation>
        {children}
        </Navigation>
              </body>
    </html>
  );
}