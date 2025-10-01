import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret")

export async function signJwt(payload: object, expiresIn = "7d") {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret)
}

export async function verifyJwt<T = any>(token: string) {
  const { payload } = await jwtVerify(token, secret)
  return payload as T
}
