type ElementStyle = {
  position?: string;
  zIndex?: number;
  top?: string;
  left?: string;
  width?: string;
  height?: string;
  overflow?: string;
  margin?: string;
  opacity?: number;
  transition?: string;
};
/**
 * Set style in batch
 * @param element
 * @param style
 */
export function setElementStyle(element: HTMLElement | null, style: ElementStyle) {
  let temStyle: { [key in string]: string | number } = {};
  Object.entries(style).forEach((s) => {
    temStyle[s[0]] = s[1];
  });
  if (element && element.style) Object.assign(element.style, temStyle);
}
