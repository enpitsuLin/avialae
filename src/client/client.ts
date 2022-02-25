const sheetsMap = new Map();

export function updateStyle(id: string, content: string) {
  let style = sheetsMap.get(id);
  if (style && !(style instanceof HTMLStyleElement)) {
    removeStyle(id);
    style = undefined;
  }
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = content;
    document.head.appendChild(style);
  } else {
    style.innerHTML = content;
  }
}

export function removeStyle(id: string) {
  const style = sheetsMap.get(id);
  if (style) {
    if (style instanceof CSSStyleSheet) {
      // @ts-expect-error: using experimental API
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter((s: CSSStyleSheet) => s !== style);
    } else {
      document.head.removeChild(style);
    }
    sheetsMap.delete(id);
  }
}
