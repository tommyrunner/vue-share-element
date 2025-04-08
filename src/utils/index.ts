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
 * 批量设置样式
 * @param element 目标元素
 * @param style 样式对象
 */
export function setElementStyle(element?: HTMLElement, style: ElementStyle = {}) {
  if (element && element.style) Object.assign(element.style, style);
}
