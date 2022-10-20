customElements.define(
    'boton-el',
    class extends HTMLElement {
        shadow = this.attachShadow({ mode: 'open' });
        constructor() {
            super();
            this.render();
        }
        render() {
            const style = document.createElement("style")
            style.textContent = `
            .boton{
                background-color: #9CBBE9;
                width: 312px;
                height: 55px;
                border:none;
                border-radius: 4px;
                font-family:roboto;
                font-size:22px;
               margin:16px 0 0 0;
            }
            `
            this.shadow.appendChild(style)
            const boton = document.createElement("button")
            boton.classList.add("boton")
            const text = this.getAttribute("text") as any
            boton.innerHTML = text
            this.shadow.appendChild(boton)
        }
    });
