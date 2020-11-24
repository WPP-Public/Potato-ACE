const COMPONENT = 'component-video';


export default class ComponentVideo extends HTMLElement {
  constructor() {
    super();

    this.hoverAndFocusHandler = this.hoverAndFocusHandler.bind(this);
  }


  connectedCallback() {
    this.videoEl = this.querySelector('video');
    this.linkEl = this.querySelector('a');

    this.linkEl.addEventListener('blur', this.hoverAndFocusHandler);
    this.linkEl.addEventListener('focus', this.hoverAndFocusHandler);
    this.linkEl.addEventListener('mouseenter', this.hoverAndFocusHandler);
    this.linkEl.addEventListener('mouseleave', this.hoverAndFocusHandler);
  }


  disconnectedCallback() {
    this.linkEl.removeEventListener('blur', this.hoverAndFocusHandler);
    this.linkEl.removeEventListener('focus', this.hoverAndFocusHandler);
    this.linkEl.addEventListener('mouseenter', this.hoverAndFocusHandler);
    this.linkEl.addEventListener('mouseleave', this.hoverAndFocusHandler);
  }


  hoverAndFocusHandler(e) {
    const active = (e.type === 'mouseenter' || e.type === 'focus');

    if (active) {
      this.videoEl.play();
    } else {
      this.videoEl.pause();
      this.videoEl.currentTime = 0;
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  customElements.define(COMPONENT, ComponentVideo);
});
