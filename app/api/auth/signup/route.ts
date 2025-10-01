import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signJwt } from "@/lib/auth/jwt"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: "invalid" }, { status: 400 })
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: "email_in_use" }, { status: 409 })
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, password: hash } })
    const token = await signJwt({ uid: user.id })
    const res = NextResponse.json({ ok: true })
    res.cookies.set("studio_session", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/" })
    return res
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
