import { nanoid } from "nanoid"

export const genId = () => nanoid(8)
export const snap = (n: number, grid = 8) => Math.round(n / grid) * grid
