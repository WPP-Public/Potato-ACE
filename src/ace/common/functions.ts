/* FUNCTIONS THAT CAN BE USED BY ANY COMPONENT */
import {DISPLAY_NAME, FOCUSABLE_ELEMENTS_SELECTOR, KEYS, UTIL_ATTRS} from './constants.js';
import {KeyType} from './types.js';


/*
  Automatically assign IDs to components that do not have them
*/
export const autoID = (component: string): void => {
  let i = 0;
  document
    .querySelectorAll(component)
    .forEach((elem) => {
      if (elem.id) {
        return;
     }

      let newId;
      // Ensure ID is unique
      do {
        i++;
        newId = `${component}-${i}`;
      } while (document.getElementById(newId));

      elem.id = newId;
   });
};


/*
  Warn user if element doesn't have aria-label nor aria-labelledby, or aria-labelledby is set to a non-existing element or an element with no text content
*/
export const warnIfElHasNoAriaLabel = (element: HTMLElement, elementName: string, ancestorElWithId?: HTMLElement): void => {
  const elementHasLabel = element.hasAttribute('aria-label');
  const elementLabelledById = element.getAttribute('aria-labelledby');
  const elementWithId = ancestorElWithId || element;
  if (elementLabelledById) {
    const labelEl = document.getElementById(elementLabelledById);
    if (!labelEl) {
      console.warn(`${DISPLAY_NAME}: ${elementName} with ID '${elementWithId.id}' has 'aria-labelledby' attribute set to an element that does not exist.`);
    } else if (!labelEl.textContent.length) {
      console.warn(`${DISPLAY_NAME}: ${elementName} with ID '${elementWithId.id}' has 'aria-labelledby' attribute set to an element with no text content.`);
    }
  } else if (!elementHasLabel) {
    console.warn(`${DISPLAY_NAME}: ${elementName} with ID '${elementWithId.id}' requires an 'aria-label' or an 'aria-labelledby' attribute.`);
  }
};


/*
  Search a given container for an element using a given attribute, if not found find element using given selector, set the given attribute on it, then return the element.
*/
export const getElByAttrOrSelector = (container: Element, attr: string, selector: string): HTMLElement =>  {
  let el = container.querySelector(`[${attr}]`) as HTMLElement;
  if (!el) {
    el = container.querySelector(selector);
    if (el) {
      el.setAttribute(attr, '');
    }
  }
  return el;
};


/*
  Search a given container for elements using a given attribute, if none found find elements using given selector, set the given attribute on them, then return the elements.
*/
export const getElsByAttrOrSelector = (container: Element, attr: string, selector: string): NodeListOf<HTMLElement> =>  {
  let el = container.querySelectorAll(`[${attr}]`);
  if (!el.length) {
    el = container.querySelectorAll(selector);
    el.forEach(el => el.setAttribute(attr, ''));
  }
  return el as NodeListOf<HTMLElement>;
};


/*
  Increments or decrements a given index based on direction and total number of items, looping around if necessary, and returns new index.
*/
export const getIndexOfNextItem = (startIndex: number, direction: -1|1, itemsTotal: number, loopAround=false): number => {
  let newIndex = startIndex + direction;
  if (newIndex < 0) {
    newIndex = loopAround ? itemsTotal - 1 : 0;
  } else if (newIndex === itemsTotal) {
    newIndex = loopAround ? 0 : itemsTotal - 1;
  }
  return newIndex;
};


/*
  Checks if an element will overflow to the bottom or the right
  of the viewport and adds utility attibutes to prevent either or both.
  Util attributes are in `./_utils.scss`
*/
export const handleOverflow = (elem: HTMLElement, verticalOnly = false): void => {
  if (!verticalOnly) {
    elem.removeAttribute(UTIL_ATTRS.FLOAT_LEFT);
  }
  elem.removeAttribute(UTIL_ATTRS.FLOAT_ABOVE);
  const bounding = elem.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  if (bounding.bottom > viewportHeight && bounding.height < viewportHeight) {
    elem.setAttribute(UTIL_ATTRS.FLOAT_ABOVE, '');
  }

  if (!verticalOnly && bounding.right > (window.innerWidth || document.documentElement.clientWidth)) {
    elem.setAttribute(UTIL_ATTRS.FLOAT_LEFT, '');
  }
};


/*
  Check if key pressed matches any key in the provided keysToMatch array
*/
export const keyPressedMatches = (keyPressed: string | number, keysToMatch: Array<KeyType> | KeyType): boolean => {
  const keys = Array.isArray(keysToMatch) ? keysToMatch : [keysToMatch];
  return keys.some((key) => key.CODE === keyPressed || key.KEY === keyPressed);
};


/*
  Gets focusable descendants and filters out non-interactable ones and returns the focusable descendants and interactable descendants
*/
export const getInteractableDescendants = (element: HTMLElement): Array<Array<HTMLElement>> => {
  const focusableDescendants = ([...element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR)] as Array<HTMLElement>);
  const interactableDescendants = focusableDescendants.filter((element) => {
    const elComputedStyle = window.getComputedStyle(element);
    return (
      !(element as any).disabled &&
      elComputedStyle.getPropertyValue('display') !== 'none' &&
      elComputedStyle.getPropertyValue('visibility') !== 'hidden'
    );
  });

  return [interactableDescendants, focusableDescendants];
};


/*
  Class applies a focus trap to a given element and adds a mutation observer that updates the focus trap when any focusable descendant's class, style or disabled attribute changes.
*/
export class FocusTrap {
  private element: HTMLElement;
  public focusableDescendants: Array<HTMLElement>;
  public interactableDescendants: Array<HTMLElement>;


  constructor(element: HTMLElement) {
    // Bind Class methods
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
    const observer = new MutationObserver((mutationList) => mutationList.forEach(() => {
      this.getInteractableDescendants();
    }));
    this.focusableDescendants.forEach((element) => observer.observe(element, mutationObserverOptions));
  }


  public getInteractableDescendants(): void {
    [this.interactableDescendants, this.focusableDescendants] = getInteractableDescendants(this.element);
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
