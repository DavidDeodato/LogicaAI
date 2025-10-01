import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJwt } from "@/lib/auth/jwt"

function getToken(req: Request) {
  const cookie = (req as any).headers.get("cookie") || ""
  return cookie.split(";").map((s: string) => s.trim()).find((s: string) => s.startsWith("studio_session="))?.split("=")[1]
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = getToken(req)
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    const { uid } = await verifyJwt<{ uid: string }>(token)
    const proj = await prisma.project.findFirst({ where: { id: params.id, ownerId: uid } })
    if (!proj) return NextResponse.json({ error: "not_found" }, { status: 404 })
    return NextResponse.json({ project: proj })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = getToken(req)
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    const { uid } = await verifyJwt<{ uid: string }>(token)
    const body = await req.json()
    const data = body?.data
    const name = body?.name
    const updated = await prisma.project.update({ where: { id: params.id }, data: { data, name } })
    if (updated.ownerId !== uid) return NextResponse.json({ error: "forbidden" }, { status: 403 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
