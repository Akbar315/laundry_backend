// src/auth/interfaces/user.interface.ts


export interface JwtUserPayload {
  ph_no: string;      // Phone number
  sub: string;        // User ID (UUID)
  
  iat?: number;       // Issued at
  exp?: number;       // Expiration
}