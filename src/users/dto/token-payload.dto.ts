export class TokenPayload {
  sub: string;
  type?: number;
  /**
   * Issued at
   */
  iat: number;
  /**
   * Expiration time
   */
  exp: number;
}

export type TokenData = Partial<TokenPayload>;
