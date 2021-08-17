import { initializeApp } from 'firebase/app'
import { createContext } from 'react'

const firebaseConfigOld = {
  apiKey: "AIzaSyD55hxeplgW4FJwh08hgkOedMqUIyjDooM",
  authDomain: "kokopelli-2c629.firebaseapp.com",
  databaseURL: "https://kokopelli-2c629-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kokopelli-2c629",
  storageBucket: "kokopelli-2c629.appspot.com",
  messagingSenderId: "277517519568",
  appId: "1:277517519568:web:3a1d1a881ab4087b2fecd5",
  measurementId: "G-LXD6S03KPK"
};

const firebaseConfig = {
  apiKey: "AIzaSyBv_YrLr2LciyiAk-6UgMlQ6vMWY7MS8Qo",
  authDomain: "kokopelli-dev.firebaseapp.com",
  databaseURL: "https://kokopelli-dev-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kokopelli-dev",
  storageBucket: "kokopelli-dev.appspot.com",
  messagingSenderId: "268666537589",
  appId: "1:268666537589:web:8a63b6bfd1193aa2485a3c"
};


export const firebase = initializeApp(firebaseConfig)
export const FirebaseContext = createContext({})