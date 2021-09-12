import Firebase from "../../db"
import React from 'react'
import {doc, getDoc, getFirestore, onSnapshot} from "@firebase/firestore"
import { getAuth } from "@firebase/auth"
import Instance from "./AdminInstance"
import {
  Grid
} from '@material-ui/core'
const auth = getAuth(Firebase)
const database = getFirestore()
function AdminInstanceSelectContainer(){
  const [, updateState] = React.useState();
  const [admin_status, updateStateAdminInstances] = React.useState();

  const forceUpdateAdminInstances = React.useCallback(() => updateStateAdminInstances({}), []);
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [multi_instance, setMultiInstance] = React.useState()
  const [user, setUser] = React.useState({
    instances: []
  })
  const [instances, setInstances] = React.useState([])
  const [instancesAdmin, setInstancesAdmin] = React.useState([])

  React.useEffect(() => {
    const docRef = doc(database, "users", auth.currentUser.uid)
    onSnapshot((docRef), (doc) => {
            setUser({instances: doc.data().instances})
    })
  }, [])

  React.useEffect(() => {
    if (user.instances.length > 1){
      setMultiInstance(true)
      var current_instances = []
      function setInstanceValues(update){
          if (current_instances.length != user.instances.length && update == false){
              return;
          } else {
              setInstances(current_instances)
              if (update == true){
                  forceUpdateAdminInstances()
              }
          }

      }
      user.instances.map(async (instance, index) => {
          const docRef = doc(database, "instances", instance)
          onSnapshot((docRef), (doc) => {
              var instance_data = doc.data() 
              if (current_instances.find(data => data.id == instance)){
                  var instanceLoc = current_instances.findIndex(existing_instance => existing_instance.id == instance)
                  instance_data.id = instance
                  current_instances[instanceLoc] = instance_data
                  setInstanceValues(true)
              } else {
                  var instance_data = doc.data()
                  instance_data.id = instance
                  current_instances.push(instance_data)
                  setInstanceValues(false)
              }
          })
      })
  }
  }, [user])

  React.useEffect(() => {
    let current_instances = []
    instances.map(async (instance) => {
      const docRef = doc(database, "instances", instance.id, "users", auth.currentUser.uid)
      function setAdminInstances(update){
        if (current_instances.length != instances.length && update == false){
          return;
        } else {
          setInstancesAdmin(current_instances)
          if (update == true){
            forceUpdate()
          }
        }
      }
      onSnapshot((docRef), (doc) => {
        var instance_data = {
          id: instance.id,
          name: instance.name,
          admin: null
        }
        if (current_instances.find(data => data.id == instance.id)){
          if (doc.exists()){
            instance_data.admin = doc.data().admin
          } else {
            instance_data.admin = false
          }
          var instanceLoc = current_instances.findIndex(existing_instance => existing_instance.id == instance.id)
          current_instances[instanceLoc] = instance_data
          setAdminInstances(true)
        } else {
          if (doc.exists()){
            instance_data.admin = doc.data().admin
            current_instances.push(instance_data)
            setAdminInstances(false)
          } else {
            instance_data.admin = false
            current_instances.push(instance_data)
            setAdminInstances(false)
          }
        }
      })
    })
  }, [instances, admin_status])
  return(
    <>
    {instancesAdmin.length > 0 ?
                <Grid mt={1} container spacing={2} justifyContent="space-evenly" direction="row">
    {instancesAdmin.map((instance) => {
      if (instance.admin != true){
        return;
      } else {
        return(
        <Instance key={instance.id} name={instance.name} id={instance.id} />
        )
      }
    })}
    </Grid>
    : ""}
    </>
  )
}


export default AdminInstanceSelectContainer