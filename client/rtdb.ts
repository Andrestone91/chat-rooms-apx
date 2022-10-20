import firebase from "firebase"

const app = firebase.initializeApp({
    apiKey: "AIsWyvtPZvsSSwrCletbw34S1FDG8HGnqSbOV63l",
    databaseURL: "https://primer-proyecto-d9b8d-default-rtdb.firebaseio.com",
    authDomain: "primer-proyecto-d9b8d.firebaseapp.com",
})
const rtdb = firebase.database()

export { rtdb }

