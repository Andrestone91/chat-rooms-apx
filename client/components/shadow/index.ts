customElements.define(
   'popup-info',
   class extends HTMLElement {
      shadow = this.attachShadow({ mode: 'open' });
      constructor() {
         super();
         this.render();
      }
      render() {
      }
   });


