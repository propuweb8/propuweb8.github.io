class MiFooter
  extends HTMLElement {
  connectedCallback() {
    this.innerHTML = 
      `<p>
        &copy; 2021
        César Ivan Tolentino Garcia.
      </p>`;
  }
}

customElements.define(
  "mi-footer", MiFooter);
