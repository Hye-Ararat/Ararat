import React from "react";
import {Container, Grid} from "../../components/base";

export default function RootLayout({ children }: { children:  React.ReactNode }) {
  return (
    <html>
      <body>
        <Container>
        <Grid container direction="column" justifyContent="center" alignItems="center" mt={30}>
        <Grid container direction="column" justifyContent="center" alignItems="center">

        {children}
        </Grid>
        </Grid>
        </Container>
      </body>
    </html>
  );
}