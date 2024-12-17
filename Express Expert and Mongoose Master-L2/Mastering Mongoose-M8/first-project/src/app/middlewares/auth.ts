//@ts-ignore
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

//extend express build in Request interface to solve given error
// interface CustomRequest extends Request {
//   user?: JwtPayload;
// } || done in index.d.ts

//creating a middleware for AUTH validation | with refactoring
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

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    // const role = decoded.role;
    // const id = decoded.userid
    const { role, userId, iat } = decoded; // using destructuring | decoded output: { userId: 'A-0001', role: 'admin', iat: 1734468199, exp: 1735332199 } || here iat is token issued at
    //securing admin
    //check if the user isExist
    const user = await User.isUserExistsByCustomId(userId); // isUserExistsByCustomId this is a static method for this it can be used anywhere according to our need
    // console.log(user);
    /* output: all user info 
     {
  _id: new ObjectId('675f5e39cb17ac0e8c7dc2b1'),
  id: 'A-0001',
  password: '$2b$12$16qvJ5QzH0s87jMVhBGzX.wyrDc5LpQ3F.JuXuk4SZ6V.QTHeJf52',
  needsPasswordChange: false,
  role: 'admin',
  status: 'in-progress',
  isDeleted: false,
  createdAt: 2024-12-15T22:54:49.131Z,
  updatedAt: 2024-12-17T20:56:31.778Z,
  __v: 0,
  passwordChangedAt: 2024-12-17T20:56:31.777Z
}*/
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    //check if the user is already deleted | isDeleted: true

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    // checking if the user is blocked

    const userStatus = user?.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }
    // functionality: if password is changed than previously created token will not work
    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ){
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized😜, Token expired as password is changed');

    }
      if (requiredRoles && !requiredRoles.includes(role)) {
        // must add above code to secure user Auth for admin i.e blocked admin cannot access
        // console.log(requiredRoles, role); //[ 'admin' ] admin
        //requiredRoles== from route && !requiredRoles.includes(role)== frondEnd Apidog
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized😜');
      }

    req.user = decoded;
    next();
  });
};

//CustomRequest must be used in all api routes to retrive the decoded userId and role

export default auth;

/* without refactoring
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
*/
