import { getAuth } from "@firebase/auth";
import { doc, getDoc, getFirestore } from "@firebase/firestore";
import { Fade } from "@material-ui/core";
import React from 'react'
import { Redirect } from "react-router";
import Dashboard from "../Dashboard";
import Firebase from "../db";
const auth = getAuth(Firebase)
const database = getFirestore()


function InstancesContainer(){
    const [user, setUser] = React.useState({
        instances: []
    })
    const [instances, setInstances] = React.useState([])

    React.useEffect(() => {
        const docRef = doc(database, "users", auth.currentUser.uid)
        async function handleUser(){
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()){
                return(docSnap.data().instances)
            } else {
                return(null)
            }
        }
        handleUser().then((response) => {
            var current_data = user
            current_data.instances = response
            setUser(current_data)
            return(current_data)
        }).then((data) => {
            console.log(data)
            var current_instances = []
            function setInstanceValues(){
                if (current_instances.length != data.instances.length){
                    return;
                } else {
                    console.log(current_instances)
                    setInstances(current_instances)
                }
            }
            data.instances.map(async (instance) => {
                console.log(instance)
                const docRef = doc(database, "instances", instance)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()){
                    var instance_data = docSnap.data()
                    console.log(instance_data)
                    current_instances.push(instance_data)
                    setInstanceValues()
                } else {
                    return(null)
                }
            })
            console.log(current_instances)
        })
    } ,[])
    return(
        <Dashboard>
        <p>Nice</p>
        {user.instances.length !=0 ? 
        user.instances.length > 1 ?
        instances.length !=0? 
        instances.map((instance, index) => {
            console.log(index)
            return(
                <Fade in={true} key={index}>
                <p>{instance.name}</p>
                </Fade>
            )
        })
        : ""
        : <Redirect to={`/${user.instances[0]}`} />
        
        : ""}
        </Dashboard>
    )
}

export default InstancesContainer