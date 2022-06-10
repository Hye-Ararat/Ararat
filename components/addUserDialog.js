import { Expand, ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Button
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import permissions from "../lib/permissions.json";

export default function AddUserDialog({ open, permSection, userState }) {
  const [acUsers, setacUsers] = useState(null);
  const [fullUsers, setFullUsers] = useState(null);
  const [user, setUser] = useState({});
  const [viewedPane, setViewedPane] = useState(0);
  useEffect(() => {
    axios.get("/api/v1/users").then((res) => {
      setFullUsers(res.data.metadata);
      let tempUsers = [];
      res.data.metadata.forEach((user) => {
        tempUsers.push({
          label: user.firstName + " (" + user.email + ")",
          id: user.id,
          value: user.id
        });
      });
      setacUsers(tempUsers);
    });
  }, []);
  return (
    <Dialog open={open}>
      <DialogTitle>
        <Typography variant="h6" align="center" fontFamily="Poppins">
          Add User to {permSection[0].toUpperCase() + permSection.substring(1, permSection.length)}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ minWidth: 600 }}>
        <Typography align="center" sx={{ mb: 1 }}>
          Select the user you would like to add to this {permSection}:
        </Typography>
        {acUsers ? (
          <Autocomplete
            onChange={(e, value) => {
              if (value) {
                setUser({
                  id: fullUsers[e.target.value].id,
                  firstName: fullUsers[e.target.value].firstName,
                  lastName: fullUsers[e.target.value].lastName,
                  email: fullUsers[e.target.value].email,
                  permissions: []
                });
              } else {
                setUser({});
              }
            }}
            sx={{ mr: "auto", ml: "auto" }}
            options={acUsers}
            renderInput={(params) => (
              <TextField autoComplete="off" placeholder="Enter email" {...params} sx={{ minWidth: "300px" }} />
            )}
          />
        ) : (
          ""
        )}
        {user.permissions ? (
          <>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Typography align="center" fontFamily="Poppins" variant="h6" sx={{ mb: 1 }}>
              Permissions
            </Typography>
            {Object.keys(permissions[permSection]).map((permissionHead, index) => {
              return (
                <Accordion key={permissionHead} expanded={viewedPane == index} onClick={() => setViewedPane(index)}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6" fontFamily="Poppins">
                      {permissionHead[0].toUpperCase() + permissionHead.substring(1, permissionHead.length)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container direction="column">
                      {Object.keys(permissions[permSection][permissionHead]).map((permSec) => {
                        return (
                          <>
                            <Typography key={permSec} fontWeight="600">
                              {permSec[0].toUpperCase() + permSec.substring(1, permSec.length)}
                            </Typography>
                            <Grid container direction="row">
                              {permissions[permSection][permissionHead][permSec].map((perm) => {
                                return (
                                  <FormControlLabel
                                    key={perm}
                                    label={
                                      perm.includes("-")
                                        ? perm.split("-")[0].toUpperCase()[0] +
                                          perm.split("-")[0].slice(1, perm.split("-")[0].length) +
                                          " " +
                                          perm.split("-")[1].toUpperCase()[0] +
                                          perm.split("-")[1].slice(1, perm.split("-")[1].length)
                                        : perm[0].toUpperCase() +
                                          perm.substring(1, perm.length) +
                                          " " +
                                          permSection[0].toUpperCase() +
                                          permSection.substring(1, permSection.length)
                                    }
                                    control={
                                      <Checkbox
                                        checked={user.permissions.includes(perm)}
                                        onChange={(e) => {
                                          let perms = user.permissions;
                                          if (e.target.checked) {
                                            perms.push(perm);
                                          } else {
                                            perms.splice(perms.indexOf(perm), 1);
                                          }
                                          setUser({ ...user, permissions: perms });
                                        }}
                                      />
                                    }
                                  />
                                );
                              })}
                            </Grid>
                          </>
                        );
                      })}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </>
        ) : (
          ""
        )}
      </DialogContent>
      <DialogActions>
        {user.permissions ? (
          <Button
            onClick={() => {
              userState(user);
              setTimeout(() => {
                setUser({});
                setViewedPane(0);
              }, 500);
            }}
            variant="contained"
            color="info"
          >
            Add User
          </Button>
        ) : (
          ""
        )}
      </DialogActions>
    </Dialog>
  );
}
