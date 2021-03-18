import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig={ 
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID,
}

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = app.auth();

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export {auth, googleAuthProvider, app, db}