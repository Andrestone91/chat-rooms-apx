import { rtdb } from "./rtdb"
import map from "lodash/map"
const API_BASE_URL = "https://newchatrooms.herokuapp.com/"

const state = {
    data: {
        email: "",
        fullname: "",
        userId: "",
        roomId: "",
        messages: [],
        rtdbRoomId: ""
    },
    listeners: [],

    initLocalStorage() {
        const lastLocalStorage = localStorage.getItem("data")
        if (!lastLocalStorage) {
            return;
        } else {
            state.setState(lastLocalStorage)
        }

    },
    init() {
        const chatRoomsRef = rtdb.ref("/chatrooms/general")
        const currentState = this.getState();
        chatRoomsRef.on("value", (snapshot) => {
            const messageFromServer = snapshot.val();
            console.log(messageFromServer);
            const messageList = map(messageFromServer.message)
            currentState.messages = messageList
            this.setState(currentState)
        })
    },
    listenRoom() {
        const cs = this.getState()
        const chatRoomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId)

        chatRoomsRef.on("value", (snapshot) => {

            const messageFromServer = snapshot.val();

            const messageList = map(messageFromServer.message)

            cs.messages = messageList
            this.setState(cs)
        })

    },
    getState() {
        return this.data
    },
    newUser(callback) {
        const cs = this.getState()
        if (cs.email) {
            fetch(API_BASE_URL + "/signup", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ email: cs.email, nombre: cs.fullname })
            }).then(data => {
                return data.json()
            }).then(res => {
                cs.userId = res.id
                this.setState(cs)
                callback()
            })
        }
    },
    setNombre(nombre: string) {
        const currentState = this.getState();
        currentState.nombre = nombre
        this.setState(currentState)
    },
    pushMessage(message: string) {
        const cs = this.getState()
        const nombreDelState = cs.fullname
        const room = cs.roomId
        fetch(API_BASE_URL + "/rooms/" + cs.rtdbRoomId, {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                from: nombreDelState,
                message: message,
                data: Date()
            })
        }).then(res => {
            return res.json()
        }).then(data => {
            console.log(data);

        })
    },

    setEmailAndFullname(email: string, fullname: string) {
        const cs = this.getState()
        cs.fullname = fullname;
        cs.email = email;
        this.setState(cs)
    },

    setState(newState) {
        this.data = newState
        for (const cb of this.listeners) {
            cb()
        }
        localStorage.setItem("data", JSON.stringify(newState))
        console.log("he cambiado", this.data);
    },
    signIn(callback) {
        const cs = this.getState();
        if (cs.email) {
            fetch(API_BASE_URL + "/auth", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ email: cs.email })
            }).then((res) => {
                return res.json()
            }).then((data) => {
                cs.userId = data.id;
                state.setState(cs)
                callback()
            })
        } else {
            console.error("no hay un email en el state");
            callback(true)
        }
    },
    askNewRoom(callback?) {
        const cs = this.getState();
        if (cs.userId) {

            fetch(API_BASE_URL + "/rooms", {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ userId: cs.userId })
            }).then((res) => {
                return res.json()
            }).then((data) => {
                if (cs.roomId == "")
                    cs.roomId = data.id;
                state.setState(cs)

                if (callback) {
                    callback()
                }
            })

        } else {
            console.error("no hay user id");
        }
    },
    setRoom(callback?, room?) {
        const cs = this.getState()
        return fetch(API_BASE_URL + "/rooms/auth", {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({ id: room })
        }).then(data => {
            return data.json()
        }).then(res => {
            if (!res.id) {
                alert(`no se encontro la sala ${room}`)
            } else {
                cs.roomId = res.id;
                state.setState(cs)
            }
            if (callback) {
                callback()
            }
        })
    },
    accessToRoom(callback?) {
        const cs = this.getState()
        const roomId = cs.roomId
        fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + cs.userId, {
        }).then((res) => {
            return res.json()
        }).then((data) => {
            cs.rtdbRoomId = data.rtdbRoomId;
            state.setState(cs)
            this.listenRoom()
            if (callback) {
                callback()
            }
        })
    },
    suscribe(callback: (any) => any) {
        this.listeners.push(callback)
    },
    addItem(item: string) {
        const cs = this.getState()

        cs.list.push(item)
        this.setState(cs)
    }
}
export { state };