import { Button, Grid, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import CreateMagmaCube from "../../../components/admin/magma_cubes/CreateMagmaCube";
import Navigation from "../../../components/admin/Navigation";
import Table from "../../../components/admin/Table";
import prisma from "../../../lib/prisma";

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
  var { verify, decode } = require("jsonwebtoken");

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
  if (user_data.permissions.includes("list-magmaCubes")) {
    var magma_cubes = await prisma.magmaCube.findMany();
    console.log(magma_cubes);
  }
  return {
    props: {
      magma_cubes: magma_cubes ? JSON.parse(JSON.stringify(magma_cubes)) : JSON.parse(JSON.stringify([])),
      user: JSON.parse(JSON.stringify(user_data))
    }
  };
}

export default function MagmaCubes({ magma_cubes, user }) {
  const [magmaCubeRows, setMagmaCubeRows] = useState([]);
  const [createMagmaCube, setCreateMagmaCube] = useState(false);
  useEffect(() => {
    var rows = [];
    magma_cubes.forEach(async (magma_cube) => {
      rows.push({
        cells: [magma_cube.name, magma_cube.stateless ? "Stateless Single Application Container" : "Full OS Instance"]
      });
    });
    setMagmaCubeRows(rows);
  }, []);
  return (
    <>
      <Grid direction="row" container>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Images
        </Typography>
        {user.permissions.includes("create-magmaCube") ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCreateMagmaCube(true)}
              sx={{ mt: "auto", mb: "auto", ml: "auto" }}
            >
              Create Image
            </Button>
            <Modal open={createMagmaCube} onClose={() => setCreateMagmaCube(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "50%",
                  bgcolor: "background.paper",
                  border: "2px solid #000",
                  boxShadow: 24,
                  p: 4
                }}
              >
                <Grid container direction="column" sx={{ p: 3 }}>
                  <Typography variant="h5">Create Image</Typography>
                  <CreateMagmaCube />
                </Grid>
              </Box>
            </Modal>
          </>
        ) : (
          ""
        )}
      </Grid>
      {!user.permissions.includes("list-magmaCubes") ? (
        <Typography variant="h6" sx={{ mb: 1 }}>
          You do not have permission to view this page.
        </Typography>
      ) : (
        <Table cells={["Name", "Stateless"]} rows={magmaCubeRows} />
      )}
    </>
  );
}

MagmaCubes.getLayout = (page) => {
  return <Navigation page="magma_cubes">{page}</Navigation>;
};
