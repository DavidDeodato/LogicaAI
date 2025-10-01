import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signJwt } from "@/lib/auth/jwt"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return NextResponse.json({ error: "invalid_credentials" }, { status: 401 })
    const token = await signJwt({ uid: user.id })
    const res = NextResponse.json({ ok: true })
    res.cookies.set("studio_session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" })
    return res
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
