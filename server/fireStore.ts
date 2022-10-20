import * as admin from "firebase-admin"
import * as serviceAccount from "../key.json"

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: "https://primer-proyecto-d9b8d-default-rtdb.firebaseio.com"
});

const fireStore = admin.firestore()
const rtdb = admin.database()

export { fireStore, rtdb }