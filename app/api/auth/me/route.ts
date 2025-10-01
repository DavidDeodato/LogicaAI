import { NextResponse } from "next/server"
import { verifyJwt } from "@/lib/auth/jwt"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const cookie = (req as any).headers.get("cookie") || ""
    const token = cookie.split(";").map((s: string) => s.trim()).find((s: string) => s.startsWith("studio_session="))?.split("=")[1]
    if (!token) return NextResponse.json({ user: null })
    const payload = await verifyJwt<{ uid: string }>(token)
    const user = await prisma.user.findUnique({ where: { id: payload.uid }, select: { id: true, email: true } })
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
