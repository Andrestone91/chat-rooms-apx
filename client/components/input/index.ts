customElements.define(
    'input-el',
    class extends HTMLElement {
        shadow = this.attachShadow({ mode: 'open' });
        constructor() {
            super();
            this.render();
        }
        render() {
            const style = document.createElement("style")
            style.textContent = `
            .input{
                width:288px;
                height:42px;
                padding: 0 10px 0 10px;
                border: 2px solid #000000;
                border-radius: 4px;
            }
            `
            this.shadow.appendChild(style)
            const inputEl = document.createElement("input")
            inputEl.classList.add("input")
            const type = this.getAttribute("type") as any
            inputEl.type = type
            const placeholder = this.getAttribute("placeholder") as any
            inputEl.placeholder = placeholder
            this.shadow.appendChild(inputEl)
        }
    });

