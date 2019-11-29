export const autoID = (component) => {
  document.querySelectorAll(component)
    .forEach((elem, i) => {
      elem.id = elem.id || `${component}-${i+1}`;
    });
};
