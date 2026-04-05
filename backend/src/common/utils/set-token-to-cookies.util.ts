import { Response } from 'express';

const isSecureCookieEnabled = process.env.COOKIE_SECURE === 'true';

export const setTokenToCookies = (
  res: Response,
  name: string,
  token: string,
  maxAge: number,
) => {
  return res.cookie(name, token, {
    httpOnly: true,
    secure: isSecureCookieEnabled,
    sameSite: 'lax',
    maxAge,
  });
};
