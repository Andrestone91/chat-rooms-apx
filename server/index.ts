import { fireStore, rtdb } from "./fireStore";
import * as express from "express";
import { nanoid } from 'nanoid';
import * as cors from "cors"

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const usersCollection = fireStore.collection("users");
const roomsCollection = fireStore.collection("rooms");

app.post("/signup", (req, res) => {
    const email = req.body.email;
    const nombre = req.body.nombre;
    const dato = Date();
    usersCollection.where("email", "==", email).get().then((searchResponse) => {
        if (searchResponse.empty) {
            usersCollection.add({
                email,
                nombre,
                date: dato
            }).then((newUserRef) => {
                res.status(201).json({
                    id: newUserRef.id,
                    new: true,
                    date: dato
                });
            });
        } else {
            res.status(400).json({
                message: "user already exists"
            });
        };
    });
});

app.post("/auth", (req, res) => {
    const { email } = req.body;
    usersCollection.where("email", "==", email).get().then((searchResponse) => {
        if (searchResponse.empty) {
            res.status(404).json({
                message: "not found"
            })
        } else {
            //recibo el userId
            res.status(202).json({
                id: searchResponse.docs[0].id
            });
        };
    });
});

app.post("/rooms/auth", (req, res) => {
    const { id } = req.body;
    roomsCollection.doc(id.toString()).get().then(doc => {
        if (doc.exists) {
            //recibo el roomId
            res.status(200).json({
                id: doc.id,
                message: `sala ${id} encontrada`,
                rtdb: doc.data()
            });
        } else {
            res.status(400).json({
                message: `no se encontro la sala ${id}`
            });
        };
    });
});

app.post("/rooms", (req, res) => {
    const { userId } = req.body;
    usersCollection.doc(userId.toString()).get().then(doc => {
        if (doc.exists) {
            const roomRef = rtdb.ref("rooms/" + nanoid(10))
            roomRef.set({
                message: [],
                owner: userId,
            }).then(() => {
                const roomLongId = roomRef.key
                const roomId = 1000 + Math.floor(Math.random() * 999)
                roomsCollection.doc(roomId.toString()).set({
                    rtdbRoomId: roomLongId,
                }).then(() => {
                    res.json({
                        id: roomId.toString(),
                    });
                });
            });
        } else {
            res.status(401).json({
                message: "no existis"
            });
        };
    });
});

app.post("/rooms/:id", (req, res) => {
    const id = req.params.id;
    const rtdbRef = rtdb.ref("rooms/" + id + "/message")
    rtdbRef.push(
        req.body,
        function () {
            console.log(req.body);
            res.json("ok");
        });
});

app.get("/rooms/:roomId", (req, res) => {
    const { userId } = req.query;
    const { roomId } = req.params;
    usersCollection.doc(userId.toString()).get().then(doc => {
        if (doc.exists) {
            roomsCollection.doc(roomId).get().then(snap => {
                const snapData = snap.data()
                // recibo el rtbdRoomId
                res.json(snapData);
            })
        } else {
            res.status(401).json({
                message: "no existis"
            });
        };
    });
});

app.get("/users", function (req, res) {
    usersCollection.get().then(snap => {
        let docs = snap.docs;
        let allId = snap.docs.map(email => {
            return email.id;
        });
        for (let doc of docs) {
            const allData = doc.data();
            console.log(allData, doc.id);
        };
        res.json([{ cantidadUsers: docs.length }, { allId }])
    });
});

app.get("/users/:userId", function (req, res) {
    const id = req.params.userId;
    const userDoc = usersCollection.doc(id)
    userDoc.get().then(snap => {
        const userData = snap.data();
        res.json(userData);
    })
})

app.get("/messages", function (req, res) {
    const chatRoomRef = rtdb.ref("/rooms")
    chatRoomRef.get().then(snap => {
        let docs = snap.val();
        res.json([{ docs }]);
    })
})

app.get("/messages/:rtdbRoomId", function (req, res) {
    const rtdbRoomId = req.params.rtdbRoomId;
    const chatRoomRef = rtdb.ref("/rooms/" + rtdbRoomId)
    chatRoomRef.get().then(snap => {
        let doc = snap.val();
        res.json({ doc });
    });
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
    res.sendFile(__dirname, "../dist/index.html")
})
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});