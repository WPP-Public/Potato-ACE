const COMPONENT = 'component-video';
const mq = window.matchMedia("(hover: none)");


export default class ComponentVideo extends HTMLElement {
	constructor() {
		super();

		this.controlBtnClickHandler = this.controlBtnClickHandler.bind(this);
		this.hoverAndFocusHandler = this.hoverAndFocusHandler.bind(this);
		this.videoEndedHandler = this.videoEndedHandler.bind(this);
	}

	connectedCallback() {
		this.controlBtn = this.querySelector('button');
		this.linkEl = this.querySelector('a');
		this.videoEl = this.querySelector('video');


		this.controlBtn.addEventListener('click', this.controlBtnClickHandler);
		this.linkEl.addEventListener('blur', this.hoverAndFocusHandler);
		this.linkEl.addEventListener('focus', this.hoverAndFocusHandler);
		this.linkEl.addEventListener('mouseenter', this.hoverAndFocusHandler);
		this.linkEl.addEventListener('mouseleave', this.hoverAndFocusHandler);
		this.videoEl.addEventListener('ended', this.videoEndedHandler);
	}


	disconnectedCallback() {
		this.controlBtn.removeEventListener('click', this.controlBtnClickHandler);
		this.linkEl.removeEventListener('blur', this.hoverAndFocusHandler);
		this.linkEl.removeEventListener('focus', this.hoverAndFocusHandler);
		this.linkEl.addEventListener('mouseenter', this.hoverAndFocusHandler);
		this.linkEl.addEventListener('mouseleave', this.hoverAndFocusHandler);
		this.videoEl.removeEventListener('ended', this.videoEndedHandler);
	}

	controlBtnClickHandler() {
		this.controlBtn.style.display = 'none';
		const video = this.videoEl;
		const videoPlaying = !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
		this.videoEl[videoPlaying ? 'pause' : 'play']();
	}

	videoEndedHandler() {
		this.controlBtn.style.display = null;
	}

	hoverAndFocusHandler(e) {
		const active = (e.type === 'mouseenter' || e.type === 'focus');

		if (mq.matches) {
			return;
		}

		if (active) {
			this.videoEl.loop = true;
			this.videoEl.play();
		} else {
			this.videoEl.pause();
			this.videoEl.currentTime = 0;
			this.videoEl.loop = false;
		}
	}
}


document.addEventListener('DOMContentLoaded', () => {
	customElements.define(COMPONENT, ComponentVideo);
});
