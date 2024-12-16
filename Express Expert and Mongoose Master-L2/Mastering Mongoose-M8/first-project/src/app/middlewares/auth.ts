//@ts-ignore
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

//extend express build in Request interface to solve given error
// interface CustomRequest extends Request {
//   user?: JwtPayload;
// } || done in index.d.ts

//creating a middleware for AUTH validation
const auth = (...requiredRoles: TUserRole[]) => {
  //using spread .. bz we might need to multiple access like student,admin
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //   console.log(req.headers.authorization); // this authorization is send from frontend as we don't have frontend we have to manually set headers is API DOG| NOTE: it becomes small letter
    //check if token exist
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    //check if the token is valid
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }
        //decoded
        // console.log(decoded); // it will send data that is passed in auth.service.ts jwtPayload | sned only user.id | output: { userId: 'A-0001', role: 'admin', iat: 1734384934, exp: 1735248934 } must provide updated sent token from jwt
        // const { userId, role } = decoded;
        // sent the retrived decoded to req:Request so that we can access it into other api

        // Authourization using role checking
        const role = (decoded as JwtPayload).role;
        // console.log(requiredRoles, role); //[ 'admin' ] admin
        if (requiredRoles && !requiredRoles.includes(role)) {
          //requiredRoles== from route && !requiredRoles.includes(role)== frondEnd Apidog
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not authorized!',
          );
        }

        req.user = decoded as JwtPayload;
        next();
      },
    );
  });
};
//CustomRequest must be used in all api routes to retrive the decoded userId and role

export default auth;
