import { initializeApp } from 'firebase/app'
import { createContext } from 'react'

const firebaseConfig = {
  apiKey: "AIzaSyD55hxeplgW4FJwh08hgkOedMqUIyjDooM",
  authDomain: "kokopelli-2c629.firebaseapp.com",
  databaseURL: "https://kokopelli-2c629-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kokopelli-2c629",
  storageBucket: "kokopelli-2c629.appspot.com",
  messagingSenderId: "277517519568",
  appId: "1:277517519568:web:3a1d1a881ab4087b2fecd5",
  measurementId: "G-LXD6S03KPK"
};

export const firebase = initializeApp(firebaseConfig)
export const FirebaseContext = createContext({})