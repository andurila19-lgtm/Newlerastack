// src/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'super-secret-newlera-key-1234567890-change-this-in-production'
);

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name?: string;
}

// Token expiration times
export const TOKEN_EXPIRY = '7d';

/**
 * Signs a JWT payload
 */
export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Gets JWT token from request cookies
 */
export function getTokenFromCookies(request: NextRequest): string | null {
  const cookie = request.cookies.get('nwl_auth_token');
  return cookie ? cookie.value : null;
}

/**
 * Hashes a plaintext password
 */
export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/**
 * Compares plaintext password to hashed password
 */
export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}
