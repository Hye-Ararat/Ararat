import Dashboard from "../Dashboard"
import React from 'react'
import Firebase from "../db"
import {getAuth} from "firebase/auth"
import {doc, getDoc, onSnapshot, getFirestore, collection} from "firebase/firestore"
const auth = getAuth(Firebase)
var database = getFirestore()

function InstancesContainer(){
    const [user, setUser] = React.useState({
        instances: []
    })
    async function userData(){
    const docRef = doc(database, "users", auth.currentUser.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()){
        setUser({instances: docSnap.data().instances})
    } else {
        console.log('document does not exist!')
    }
    //const user_info = getDoc(userCol, auth.currentUser.uid)
    //const user_data = await getDoc(userCol, auth.currentUser.uid)
    }
    React.useEffect(() => {
        userData()
        //var doc = db.collection('users').doc('')
    }, [])
    return(
        <Dashboard>
            {user.instances.length != 0 ? <p>Loaded</p>:<p>Loading</p>}
        </Dashboard>
        )
}

export default InstancesContainer