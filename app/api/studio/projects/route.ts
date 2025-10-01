import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJwt } from "@/lib/auth/jwt"

function getToken(req: Request) {
  const cookie = (req as any).headers.get("cookie") || ""
  return cookie.split(";").map((s: string) => s.trim()).find((s: string) => s.startsWith("studio_session="))?.split("=")[1]
}

export async function POST(req: Request) {
  try {
    const token = getToken(req)
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    const { uid } = await verifyJwt<{ uid: string }>(token)
    const body = await req.json()
    const name = body?.name || "Sem título"
    const data = body?.data || { pages: [], name }
    const created = await prisma.project.create({ data: { ownerId: uid, name, data } })
    return NextResponse.json({ project: { id: created.id, name: created.name } })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const token = getToken(req)
    if (!token) return NextResponse.json({ projects: [] })
    const { uid } = await verifyJwt<{ uid: string }>(token)
    const list = await prisma.project.findMany({ where: { ownerId: uid }, select: { id: true, name: true, updatedAt: true } })
    return NextResponse.json({ projects: list })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
