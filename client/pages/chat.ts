import { state } from "../state"
type Messages = {
    from: String,
    message: String
}
export class ChatMessage extends HTMLElement {

    connectedCallback() {
        state.suscribe(() => {
            const currentState = state.getState()
            this.messages = currentState.messages
            console.log(this.messages);

            this.render()
        })
        this.render();
    }
    scrollDown() {
        const scrollDiv = document.getElementById("scrollDiv")
        if (scrollDiv) {
            scrollDiv.scrollTop = scrollDiv.scrollHeight
        }
    }
    addListeners() {
        const form = document.querySelector(".form-container")
        const inputEl = document.querySelector(".input__c") as any
        form?.addEventListener("submit", (e) => {
            e.preventDefault()
            const target = e.target as any
            const input = target.chat.value
            state.pushMessage(input as any)
            inputEl.value = ""
        })
    }

    messages: Messages[] = [];
    render() {
        const bubbles: string[] = []

        for (const me of this.messages) {
            bubbles.push(
                `<div class="me" autor="${me.from}"><p class="user">${me.from}</p>${me.message}</div>`)
        }
        const cs = state.getState();
        const habitacion = cs.roomId
        this.innerHTML = ` 
        <header-el></header-el>
            <div class="contenedor">
              <title-el class ="title" title="Sala de chat"></title-el>
                  <h2 class="codeRoom">room: ${habitacion}</h2>
                   <div class="messages" id="scrollDiv">
                    ${bubbles.join("")}
              
                  </div>
              <form class="form-container"
                <div class="submit-message">
                  <input class="input__c" placeholder="chatea" name="chat" type="text">
                  <button class="boton__c" ">Enviar</button>
                </div>
                </form>
            </div>
            <footer class="footer"></footer>
            `

        const style = document.createElement("style")
        style.innerHTML = `
        .me{
            height:auto;
        }
        .contenedor{
            display:flex;
            flex-direction: column;
            align-items:center;
           
            height: 90vh;
            justify-content: space-around;
           width:350px;
           margin: 0 auto
        }
        .user{
            margin:0 0 5px 0;;
            color:maroon;
        }
      
        .submit-message{
            display:flex;
            flex-direction: column;
            align-items:center;
        }
        .title{
            text-align:center;
            text-shadow: 0 0 34px blanchedalmond;
        }
        .codeRoom{
            margin:0;
            color:white;
            text-shadow: 0 0 34px blanchedalmond;
        }
        .messages{
            width:312px;
            display:flex;
            flex-direction:column;
           margin:5px auto;
            font-family:roboto;
            overflow-y: scroll;
            min-height:300px;
        }
        .me-send{
            text-align:end;
            margin-left: auto;
            padding:16px;
            background:#d9fdd3;
            word-break: break-word;
            margin-bottom: 5px;
            border-radius: 10px;
           
        }
        .me-received{
            text-align:start;
            margin-right: auto;
            padding:16px;
            background:#D8D8D8;
            word-break: break-word;
            margin-bottom: 5px;
            border-radius: 10px;
         
        }
        .footer{
         
        }
        .input__c{
            width:312px;
            height:42px;
            padding: 0 10px 0 10px;
            border: 2px solid #000000;
            border-radius: 4px;
        }
        .boton__c{
            background-color: #9CBBE9;
            width: 312px;
            height: 55px;
            border:none;
            border-radius: 4px;
            font-family:roboto;
            font-size:22px;
            margin:16px 0 0 0;
        }
        .form-container{
            text-align:center;
        }
        `
        this.appendChild(style)
        this.addListeners()

        // AUTORES
        const messagesList = this.querySelectorAll(".me")

        const currentState = state.getState()
        const user = currentState.fullname

        messagesList.forEach((res) => {
            const autor = res.getAttribute("autor")
            if (autor == user) {
                console.log("soy yo");
                res.classList.add("me-send")
            } else {
                console.log("no soy yo");
                res.classList.add("me-received")
            }
        })
        this.scrollDown()
    }
}
customElements.define("custom-chat", ChatMessage)