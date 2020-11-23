/*
  Class applies a focus trap to a given element and adds a mutation observer that updates the focus trap when any focusable descendant's class, style or disabled attribute changes.
*/
import {FOCUSABLE_ELEMENTS_SELECTOR, KEYS} from './constants.js';
import {isInteractable, keyPressedMatches} from './functions.js';


export default class FocusTrap {
  private element: HTMLElement;
  public focusableDescendants: Array<HTMLElement>;
  public interactableDescendants: Array<HTMLElement>;


  constructor(element: HTMLElement) {
    // Bind class methods
    this.destroy = this.destroy.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.getInteractableDescendants = this.getInteractableDescendants.bind(this);


    this.element = element;
    this.getInteractableDescendants();


    element.addEventListener('keydown', this.keydownHandler);


    // Update the interactable descendants if 'style', 'class' or 'disabled' attributes of an interactable descendant changes
    const mutationObserverOptions = {
      attributeFilter: ['style', 'class', 'disabled'],
      attributes: true,
    };
    const observer = new MutationObserver((mutations) => mutations.forEach(() => this.getInteractableDescendants()));
    this.focusableDescendants.forEach((element) => observer.observe(element, mutationObserverOptions));
  }


  public getInteractableDescendants(): void {
    this.focusableDescendants =
      ([...this.element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR)] as Array<HTMLElement>);
    this.interactableDescendants = this.focusableDescendants.filter(isInteractable);
  }


  public destroy(): void {
    this.element.removeEventListener('keydown', this.keydownHandler);
  }


  private keydownHandler(e: KeyboardEvent): void {
    const keyPressed = e.key || e.which || e.keyCode;
    if (!keyPressedMatches(keyPressed, KEYS.TAB)) {
      return;
    }

    const firstInteractableDescendant = this.interactableDescendants[0];
    const lastInteractableDescendant = this.interactableDescendants[this.interactableDescendants.length - 1];
    const activeEl = document.activeElement;
    if (e.shiftKey && activeEl === firstInteractableDescendant) {
      e.preventDefault();
      lastInteractableDescendant.focus();
      return;
    }
    if (!e.shiftKey && activeEl === lastInteractableDescendant) {
      e.preventDefault();
      firstInteractableDescendant.focus();
    }
  }
}
