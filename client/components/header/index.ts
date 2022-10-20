customElements.define("header-el",
    class extends HTMLElement {
        constructor() {
            super()
            this.render()
        }
        render() {
            this.innerHTML = "by Andrestone"
            this.style.display = "flex"
            this.style.justifyContent = "center"
            this.style.alignItems = "center"
            this.style.backgroundColor = "#FF8282"
            this.style.height = "60px"
            this.style.fontSize = "22px"
            this.style.fontFamily = "system-ui";
        }
    })


