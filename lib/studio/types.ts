export type Rect = { x: number; y: number; w: number; h: number }
export type ElementType = "text" | "button" | "input" | "box" | "image" | "shape"
export type ElementStyle = {
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  fontSize?: number
  fontWeight?: number
  fontFamily?: string
  opacity?: number
  zIndex?: number
  rotateDeg?: number
}
export type Element = {
  id: string
  type: ElementType
  rect: Rect
  text?: string
  props?: Record<string, unknown>
  linkToPageId?: string
  style?: ElementStyle
}
export type Page = { id: string; name: string; elements: Element[] }
export type ProjectState = {
  id: string
  name: string
  entry?: string
  pages: Page[]
  createdAt: string
  updatedAt: string
}
