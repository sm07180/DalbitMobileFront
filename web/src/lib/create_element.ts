type Element = {
  type: string;
  text?: string;
  className?: string;
  style?: object;
  children?: Array<Element>;
  event?: Array<{ type: string; callback: () => void }>;
};

export function createElement(data: Element) {
  const { type, text, className, style, children, event } = data;

  const elem = document.createElement(type);

  if (text) {
    elem.textContent = text;
  }

  if (className) {
    const classNameArray = className.split(" ");
    classNameArray.forEach(function(val) {
      elem.classList.add(val);
    });
  }

  if (style) {
    Object.keys(style).forEach((key) => {
      elem.style[key] = style[key];
    });
  }

  if (children && children.length > 0) {
    const fragment = document.createDocumentFragment();
    children.forEach((child) => {
      const childElem = createElement(child);
      fragment.appendChild(childElem);
    });

    elem.appendChild(fragment);
  }

  if (event && event.length > 0) {
    event.forEach((e) => {
      const { type, callback } = e;
      elem.addEventListener(type, callback);
    });
  }

  return elem;
}
