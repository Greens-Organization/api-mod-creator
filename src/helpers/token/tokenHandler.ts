import * as jose from "jose";

export async function generateToken(
  payload: any,
  secret: string,
  expiresIn: string,
) {
  const secretForCreation = new TextEncoder().encode(secret);

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretForCreation);

  return jwt;
}

export async function verifyToken(token: string, secret: string) {
  const secretForCreation = new TextEncoder().encode(secret);

  const { payload, protectedHeader } = await jose.jwtVerify(
    token,
    secretForCreation,
  );
  return { payload, protectedHeader };
}
