import { Rect } from "./types"

export type SpatialIndex = {
  cellSize: number
  cells: Map<string, Set<string>>
  rects: Map<string, Rect>
}

const KEY = (cx: number, cy: number) => `${cx}:${cy}`

export function intersects(a: Rect, b: Rect, margin = 8): boolean {
  const ax1 = a.x - margin,
    ay1 = a.y - margin,
    ax2 = a.x + a.w + margin,
    ay2 = a.y + a.h + margin
  const bx1 = b.x,
    by1 = b.y,
    bx2 = b.x + b.w,
    by2 = b.y + b.h
  return !(ax2 <= bx1 || bx2 <= ax1 || ay2 <= by1 || by2 <= ay1)
}

export function occupiesCells(rect: Rect, cellSize: number): string[] {
  const x1 = Math.floor(rect.x / cellSize)
  const y1 = Math.floor(rect.y / cellSize)
  const x2 = Math.floor((rect.x + rect.w) / cellSize)
  const y2 = Math.floor((rect.y + rect.h) / cellSize)
  const keys: string[] = []
  for (let cy = y1; cy <= y2; cy++) for (let cx = x1; cx <= x2; cx++) keys.push(KEY(cx, cy))
  return keys
}

export function buildSpatialIndex(elements: { id: string; rect: Rect }[], cellSize = 32): SpatialIndex {
  const cells = new Map<string, Set<string>>()
  const rects = new Map<string, Rect>()
  for (const e of elements) {
    rects.set(e.id, e.rect)
    for (const k of occupiesCells(e.rect, cellSize)) {
      if (!cells.has(k)) cells.set(k, new Set())
      cells.get(k)!.add(e.id)
    }
  }
  return { cellSize, cells, rects }
}

export function isFree(rect: Rect, idx: SpatialIndex): boolean {
  for (const k of occupiesCells(rect, idx.cellSize)) {
    const ids = idx.cells.get(k)
    if (!ids) continue
    for (const id of ids) {
      const r = idx.rects.get(id)!
      if (intersects(rect, r)) return false
    }
  }
  return true
}

export function snap(n: number, grid = 8) {
  return Math.round(n / grid) * grid
}

export function findFreeRectNear(desired: Rect, idx: SpatialIndex, maxSteps = 300): Rect | undefined {
  // Espiral simples de offsets
  let step = 0
  const base = { ...desired }
  const delta = 16
  while (step < maxSteps) {
    const dx = ((step % 4) < 2 ? 1 : -1) * Math.ceil(step / 4) * delta
    const dy = ((Math.floor(step / 2) % 2) === 0 ? 1 : -1) * Math.ceil(step / 4) * delta
    const cand = { x: snap(base.x + dx), y: snap(base.y + dy), w: base.w, h: base.h }
    if (isFree(cand, idx)) return cand
    step++
  }
  return undefined
}

export type PlaceIntent = {
  pageWidth?: number
  pageHeight?: number
  type: string
  size?: { w: number; h: number }
  anchor?: "right_of" | "left_of" | "below" | "above" | "center" | "top" | "bottom" | "left" | "right"
  referenceRect?: Rect
  gap?: number
}

export function resolveIntent(intent: PlaceIntent, idx: SpatialIndex): Rect {
  const size = intent.size || { w: 160, h: intent.type === "button" ? 48 : 80 }
  const gap = intent.gap ?? 24
  const ref = intent.referenceRect
  let desired: Rect

  switch (intent.anchor) {
    case "right_of":
      desired = { x: ref ? ref.x + ref.w + gap : 200, y: ref ? ref.y : 200, ...size }
      break
    case "left_of":
      desired = { x: ref ? ref.x - size.w - gap : 200, y: ref ? ref.y : 200, ...size }
      break
    case "below":
      desired = { x: ref ? ref.x : 200, y: ref ? ref.y + ref.h + gap : 200, ...size }
      break
    case "above":
      desired = { x: ref ? ref.x : 200, y: ref ? ref.y - size.h - gap : 200, ...size }
      break
    case "top":
      desired = { x: 200, y: 80, ...size }
      break
    case "bottom":
      desired = { x: 200, y: (intent.pageHeight || 1200) - size.h - gap, ...size }
      break
    case "left":
      desired = { x: gap, y: 200, ...size }
      break
    case "right":
      desired = { x: (intent.pageWidth || 1600) - size.w - gap, y: 200, ...size }
      break
    case "center":
    default:
      desired = { x: Math.floor(((intent.pageWidth || 1200) - size.w) / 2), y: 200, ...size }
      break
  }

  desired = { x: snap(desired.x), y: snap(desired.y), w: snap(size.w), h: snap(size.h) }
  if (isFree(desired, idx)) return desired
  const found = findFreeRectNear(desired, idx)
  return found || desired
}
