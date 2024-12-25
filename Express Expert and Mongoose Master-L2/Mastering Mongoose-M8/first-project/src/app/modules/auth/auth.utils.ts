import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { userId: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, { // must use return
    // expiresIn: expiresIn,
    expiresIn, // as key value same it can be directly written
  });
};

export const verifyToken = (token: string, secret: string) => { //called in auth service
  return jwt.verify(token, secret) as JwtPayload;
};