// @ts-ignore
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import AppError from '../../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';

// using reusable custom static
const loginUser = async (payload: TLoginUser) => {
  //console.log(payload); { id: 'A-0001', password: 'admin123' }
  //as this is a custom generated Id so we have to use findOne

  //check if the user isExist
  const user = await User.isUserExistsByCustomId(payload.id);
  console.log(user);
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

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match !');
  }
  //Access Granted: Send AccessToken, RefreshToken
  const jwtPayload = {
    userId: user.id, // taking from user as it is previously check as valid user
    role: user?.role,
  };
  //genereate token using node cmd:  require('crypto').randomBytes(32).toString('hex')
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    // as string to resolve undefine error
    expiresIn: '10d',
  });
  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange, // sending needsPasswordChange to let user know that password needs to be changed
  };
};

// const changePassword = async(user: { userId: string; role: string }, payload) => {
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  //check if the user isExist
  // const user = await User.isUserExistsByCustomId(userData.id);
  const user = await User.isUserExistsByCustomId(userData.userId);
  // console.log(user);
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

  //compare and check if old password matches

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match !');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    // must use findOneAndUpdate or will give error
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),// add a field in model to get specific password update time
    },
  );
  return null; // null bz we are updating a password field
};

export const AuthServices = {
  loginUser,
  changePassword,
};

//without using static that is declared in User model
// const loginUser = async (payload: TLoginUser) => {
//   //console.log(payload); { id: 'A-0001', password: 'admin123' }
//   //as this is a custom generated Id so we have to use findOne

//   //check if the user isExist
//   const isUserExist = await User.findOne({ id: payload?.id }); // matches using key val
//   //   console.log(isUserExist);
//   /*{
//           _id: new ObjectId('675f5e39cb17ac0e8c7dc2b1'),
//           id: 'A-0001',
//           password: '$2b$12$BXMQ2fHmz5w2jnW6iQbS4Ob6yTxdCOu5HujqFy8zWbR/2XuIOz28e',
//           needsPasswordChange: true,
//           role: 'admin',
//           status: 'in-progress',
//           isDeleted: false,
//           createdAt: 2024-12-15T22:54:49.131Z,
//           updatedAt: 2024-12-15T22:54:49.131Z,
//           __v: 0
//         }*/
//   if (!isUserExist) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
//   }
//   //check if the user is already deleted | isDeleted: true
//   const isDeleted = isUserExist?.isDeleted;

//   if (isDeleted) {
//     // true
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
//   }
//   //check if the user is blocked
//   const userStatus = isUserExist?.status === 'blocked';
//   //checking if the password is correct
//   const isPasswordMatched = await bcrypt.compare(
//     payload?.password,
//     isUserExist?.password,
//   );
//   //   console.log(isPasswordMatched); ture | false
//   //Access Granted: Send AccessToken, RefreshToken
//   return {};
// };
