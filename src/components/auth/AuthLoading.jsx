import { Backdrop, CircularProgress } from "@material-ui/core";
import React from "react";

function AuthLoading() {
  return (
    <React.Fragment>
      <Backdrop open={true}>
        {" "}
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
}

export default AuthLoading;
