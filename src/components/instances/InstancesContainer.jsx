import { getAuth } from "@firebase/auth";
import { doc, getFirestore, onSnapshot } from "@firebase/firestore";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
import React from "react";
import { Redirect } from "react-router";
import Firebase from "../db";
import Instance from "./Instance";
const auth = getAuth(Firebase);
const database = getFirestore();
function InstancesContainer() {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [user, setUser] = React.useState({
    instances: [],
  });
  const [instances, setInstances] = React.useState([]);
  // eslint-disable-next-line no-unused-vars
  const [multi_instance, setMultiInstance] = React.useState();

  React.useEffect(() => {
    const docRef = doc(database, "users", auth.currentUser.uid);
    onSnapshot(docRef, (doc) => {
      setUser({ instances: doc.data().instances });
    });
  }, []);
  React.useEffect(() => {
    if (user.instances.length > 1) {
      setMultiInstance(true);
      var current_instances = [];
      const setInstanceValues = (update) => {
        if (
          current_instances.length != user.instances.length &&
          update == false
        ) {
          return;
        } else {
          setInstances(current_instances);
          if (update == true) {
            forceUpdate();
          }
        }
      };
      // eslint-disable-next-line no-unused-vars
      user.instances.map(async (instance, index) => {
        const docRef = doc(database, "instances", instance);
        onSnapshot(docRef, (doc) => {
          var instance_data = doc.data();
          if (current_instances.find((data) => data.id == instance)) {
            var instanceLoc = current_instances.findIndex(
              (existing_instance) => existing_instance.id == instance
            );
            instance_data.id = instance;
            current_instances[instanceLoc] = instance_data;
            setInstanceValues(true);
          } else {
            // var instance_data = doc.data()
            instance_data.id = instance;
            current_instances.push(instance_data);
            setInstanceValues(false);
          }
        });
      });
    }
  }, [user]);
  return (
    <>
      {user.instances.length != 0 ? (
        user.instances.length > 1 ? (
          ""
        ) : (
          <Redirect to={`/instance/${user.instances[0]}`} />
        )
      ) : (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 50 }}
        >
          <CircularProgress disableShrink />
        </div>
      )}
      {instances.length > 0 ? (
        <Typography variant="h4" component="h4">
          Select an Ararat Instance
        </Typography>
      ) : (
        ""
      )}
      {instances.length > 0 ? (
        <Grid
          mt={1}
          container
          spacing={3}
          justifyContent="space-evenly"
          direction="row"
        >
          {/*eslint-disable-next-line no-unused-vars*/}
          {instances.map((instance, index) => {
            return (
              <Instance
                key={instance.id}
                name={instance.name}
                id={instance.id}
              />
            );
          })}
        </Grid>
      ) : (
        ""
      )}
    </>
  );
}

export default InstancesContainer;
