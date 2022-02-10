import { Button, ButtonGroup, IconButton, Grid, Typography, Modal, Box } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Navigation from "../../../components/admin/Navigation";
import Table from "../../../components/admin/Table";
import Link from "next/link";
import { LoadingButton } from "@mui/lab";

export async function getServerSideProps({ req, res }) {
  if (!req.cookies.access_token) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false
      }
    };
  }

  res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");

  var { connectToDatabase } = require("../../../util/mongodb");
  var { db } = await connectToDatabase();
  var { verify, decode } = require("jsonwebtoken");
  var { ObjectId } = require("mongodb");

  try {
    var valid_session = verify(req.cookies.access_token, process.env.ENC_KEY);
  } catch {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false
      }
    };
  }
  if (!valid_session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false
      }
    };
  }

  var user_data = decode(req.cookies.access_token);
  console.log(user_data);
  if (user_data.admin && user_data.admin.instances && user_data.admin.instances.read) {
    var instances = await db.collection("instances").find({}).toArray();
    console.log(instances);
  }

  return {
    props: {
      instances: instances ? JSON.parse(JSON.stringify(instances)) : JSON.parse(JSON.stringify([])),
      user: JSON.parse(JSON.stringify(user_data))
    }
  };
}
export default function Instances({ instances, user }) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [instanceRows, setInstanceRows] = useState([]);
  const [selectedInstanceID, setSelectedInstanceID] = useState(null);
  useEffect(() => {
    var rows = [];
    instances.forEach(async (instance) => {
      rows.push({
        cells: [
          instance.name,
          // eslint-disable-next-line react/jsx-key
          <Grid container>
            <Button
              aria-label="delete"
              sx={{ mr: 2 }}
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                setSelectedInstanceID(instance._id);
                setOpen(true);
              }}
              color="error"
            >
              <DeleteIcon fontSize="medium" />
            </Button>

            <Button aria-label="edit" variant="contained" color="info" onClick={() => setEdit(true)}>
              <EditIcon fontSize="medium" />
            </Button>
          </Grid>
        ]
      });
    });
    setInstanceRows(rows);
  }, []);
  return (
    <>
      <Grid direction="row" container>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Instances
        </Typography>
        <Modal
          open={open}
          onClose={(e) => {
            e.preventDefault();
            setOpen(false);
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "50%",
              bgcolor: "background.paper",
              borderRadius: 5,
              boxShadow: 24,
              p: 2
            }}
          >
            <Grid container direction="column" sx={{ p: 2 }}>
              <Typography variant="h5" align="center">
                Delete Instance
              </Typography>
              <Typography mt={3} variant="body1" align="center">
                Are you sure you want to delete this instance?
              </Typography>
              <LoadingButton
                loading={loading}
                variant={"contained"}
                sx={{ width: 50, ml: "auto", mr: "auto", mt: 2 }}
                color={"error"}
                onClick={async () => {
                  setLoading(true);
                  await axios
                    .delete("/api/v1/admin/instances/" + selectedInstanceID)
                    .then(() => {
                      window.location.reload();
                    })
                    .catch((error) => {
                      console.log("an error occured", error);
                      setLoading(false);
                      setSelectedInstanceID(null);
                      setOpen(false);
                    });
                }}
              >
                Delete
              </LoadingButton>
            </Grid>
          </Box>
        </Modal>
        <Modal
          open={edit}
          onClose={(e) => {
            e.preventDefault();
            setEdit(false);
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "50%",
              bgcolor: "background.paper",
              borderRadius: 5,
              boxShadow: 24,
            }}
          >
            <Grid container direction="column" sx={{ p: 2 }}>
              <Typography variant="h5" align="center">
                Edit Instance
              </Typography>
              
            </Grid>
          </Box>
        </Modal>
        {user.admin && user.admin.instances && user.admin.instances.write ? (
          <>
            <Link href="/admin/instances/new">
              <Button variant="contained" color="primary" sx={{ ml: "auto", mt: "auto", mb: "auto" }}>
                Create Instance
              </Button>
            </Link>
          </>
        ) : (
          ""
        )}
      </Grid>
      {user.admin && user.admin.instances && user.admin.instances.read ? (
        <>
          {instances.length > 0 ? (
            <Table cells={["Name", "Actions"]} rows={instanceRows} />
          ) : (
            <Typography>No Instances</Typography>
          )}
        </>
      ) : (
        <Typography>You do not have access to this resource</Typography>
      )}
    </>
  );
}

Instances.getLayout = function getLayout(page) {
  return <Navigation page="instances">{page}</Navigation>;
};
