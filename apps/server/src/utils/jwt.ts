import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.AUTH_SECRET;
if (!JWT_SECRET) throw new Error("Missing AUTH_SECRET env var");

export function signJwt(payload: object, expiresIn = "7d") {
  return jwt.sign(
    payload,
    JWT_SECRET as jwt.Secret,
    { expiresIn } as jwt.SignOptions
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET as jwt.Secret) as T;
  } catch (err) {
    console.error("Error: ", err);
    return null;
  }
}
