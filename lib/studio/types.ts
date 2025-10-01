export type Rect = { x: number; y: number; w: number; h: number }
export type ElementType = "text" | "button" | "input" | "box" | "image"
export type Element = {
  id: string
  type: ElementType
  rect: Rect
  text?: string
  props?: Record<string, unknown>
  linkToPageId?: string
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
