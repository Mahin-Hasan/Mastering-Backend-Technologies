import jwt from 'jsonwebtoken';

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
