import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCteyiuE6o6OU5VViEhvwr9lBsMnl5PGn4",
    authDomain: "hye-ararat.firebaseapp.com",
    databaseURL: "https://hye-ararat-default-rtdb.firebaseio.com",
    projectId: "hye-ararat",
    storageBucket: "hye-ararat.appspot.com",
    messagingSenderId: "683341327800",
    appId: "1:683341327800:web:074be2874400a7e126334d",
    measurementId: "G-N1EZ3ZLERG"
  };
/*   const firebaseConfig = {
    apiKey: "AIzaSyCteyiuE6o6OU5VViEhvwr9lBsMnl5PGn4",
    authDomain: "localhost:9099",
    databaseURL: "http://localhost:8080",
    projectId: "hye-ararat",
    storageBucket: "hye-ararat.appspot.com",
    messagingSenderId: "683341327800",
    appId: "1:683341327800:web:074be2874400a7e126334d",
    measurementId: "G-N1EZ3ZLERG"
  }; */
var Firebase = initializeApp(firebaseConfig)

export default Firebase