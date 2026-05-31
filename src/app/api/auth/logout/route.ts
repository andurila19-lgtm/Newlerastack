// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  // Set expired cookie to delete it
  response.cookies.set('nwl_auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}
