customElements.define(
    'title-el',
    class extends HTMLElement {
        shadow = this.attachShadow({ mode: 'open' });
        constructor() {
            super();
            this.render();
        }
        render() {
            const style = document.createElement("style")
            style.textContent = `
            .text{
                font-family: 'Roboto', sans-serif;
                font-size: 52px;
                text-align: center;
                margin: 10px 0 
            }
            `
            this.shadow.appendChild(style)
            const title = this.getAttribute("title")
            const div = document.createElement("div")
            div.innerHTML = `
            <h1 class="text">${title}</h1>
            `
            this.shadow.appendChild(div)
        }
    });

