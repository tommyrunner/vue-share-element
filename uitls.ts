type ElementStyle = {
    position?: string
    zIndex?: number
    top?: string
    left?: string
    width?: string
    height?: string
    overflow?: string
    margin?: string
    opacity?: number
    transition?: string
}
/**
 * Set style in batch
 * @param element 
 * @param style 
 */
export function setElementStyle(element: HTMLElement | null, style: ElementStyle) {
    Object.entries(style).forEach(s => {
        if (element && element.style) {
            let styles: { [key: string]: any } = element.style
            styles[s[0]] = s[1]
        }
    })
}