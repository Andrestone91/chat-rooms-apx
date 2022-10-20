import { Router } from "@vaadin/router"
import { state } from "../state";

// se crean los elementos
const div = document.createElement("div")
const style = document.createElement("style")

export class Home extends HTMLElement {
    connectedCallback() {
        this.render();

        const form = div.querySelector(".form")
        form?.addEventListener("submit", (e) => {
            e.preventDefault()
            const target = e.target as any
            const email = target.email.value
            const nombre = target.nombre.value
            const room = target.room.value
            const select = target.select.value

            if (email !== "" && nombre !== "") {
                if (select == "nuevo") {
                    const cs = state.getState()
                    state.setEmailAndFullname(email, nombre)
                    if (cs.rtdbRoomId && cs.userId) {
                        Router.go("/chat")
                    } else {
                        state.newUser(() => {
                            state.signIn((err) => {
                                if (err)
                                    console.error("hubo un error en el signIn");
                                state.askNewRoom(() => {
                                    state.accessToRoom(() => {
                                        Router.go("/chat")
                                    })
                                })
                            })
                        })
                    }
                } if (select == "existente") {
                    const cs = state.getState();
                    if (room !== "") {
                        state.setEmailAndFullname(email, nombre)
                    } if (cs.rtdbRoomId && cs.userId) {
                        Router.go("/chat")
                    } else {
                        state.newUser(() => {
                            state.signIn((err) => {
                                if (err)
                                    console.error("hubo un error en el signIn");
                                state.setRoom(() => {
                                    state.accessToRoom(() => {
                                        Router.go("/chat")
                                    })
                                }, room)
                            })
                        })
                    }
                }
            }
        })
    }
    render() {
        const shadow = this.attachShadow({ mode: 'open' });

        style.textContent = `
        .contenedor{
            display:flex;
            flex-direction: column;
            align-items:center;
            height:93vh;
        }
        .input_el{
            width:288px;
            height:42px;
            padding: 0 10px 0 10px;
            border: 2px solid #000000;
            border-radius: 4px;
        }
        .form{
            display:flex;
            flex-direction: column;
        }
        .boton_el{
            background-color: #9CBBE9;
            width: 312px;
            height: 55px;
            border:none;
            border-radius: 4px;
            font-family:roboto;
            font-size:22px;
            margin:16px 0 0 0;
        }
        .contenedor__label{
            margin: 0 0 0 2px;
        }
        .label{
            font-family: roboto;
            font-size: 20px;
            line-height: 28px;
            color: azure;
        }
        .title{
            padding:0 20px 0 0;
            text-shadow: 0 0 34px blanchedalmond;
        }
        .input__c{
            margin:0 0 13px 0;
        }
        .select{
            width:313px;
            height:42px;
            padding: 0 10px 0 10px;
            border: 2px solid #000000;
            border-radius: 4px;
            margin:0 0 13px 0;
        }
        .roomId{
            display:none;
        }
        `
        shadow.appendChild(style)


        div.innerHTML = ` 
        <header-el></header-el>
       
           <div class="contenedor">
              <title-el class ="title"title="Chat Rooms v2"></title-el>
                 <form class="form">
                   <div class="contenedor__label">
                      <label class="label">Email</label>
                   </div>
                   <input type="email" placeholder="email" name="email" class="input_el">
                   <div class="contenedor__label">
                      <label class="label">Tu nombre</label>
                   </div>
                   <input type="text" placeholder="nombre" name="nombre" class="input_el">
                   <div class="contenedor__label">
                      <label class="label">room</label>
                   </div>
                   <select class="select" name="select">
                      <option value="nuevo">Nuevo room</option>
                      <option value="existente" room="existe">Room existente</option>
                   </select>
                   <div class="roomId">
                     <div class="contenedor__label">
                       <label class="label">Room id</label>
                     </div>
                     <input type="text" placeholder="1234" name="room" class="input_el">
                   </div>
                     <button class="boton_el">Comenzar</button>
                 </form>
             </div>
      
        `
        const select = div.querySelector(".select") as any
        const roomId = div.querySelector(".roomId")
        select?.addEventListener("change", (e) => {
            const target = e.target as any
            if (target.value == "existente") {
                roomId?.classList.remove("roomId")
            } else {
                roomId?.classList.add("roomId")
            }
        })

        shadow.appendChild(div)
    }
}
customElements.define("home-page", Home)