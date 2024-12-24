// @ts-ignore
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import AppError from '../../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';
import { sendEmail } from '../../utils/sendEmail';

// using reusable custom static
const loginUser = async (payload: TLoginUser) => {
  //console.log(payload); { id: 'A-0001', password: 'admin123' }
  //as this is a custom generated Id so we have to use findOne

  //check if the user isExist
  const user = await User.isUserExistsByCustomId(payload.id);
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

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match !');
  }
  //Access Granted: Send AccessToken, RefreshToken
  const jwtPayload = {
    userId: user.id, // taking from user as it is previously check as valid uscreateTokener
    role: user?.role,
  };
  //genereate token using node cmd:  require('crypto').randomBytes(32).toString('hex') | without create token
  // const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
  //   // as string to resolve undefine error
  //   expiresIn: '10d',
  // });
  //with createToken
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  //if acessToken is expired we can get a new token using refreshToken
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
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
      passwordChangedAt: new Date(), // add a field in model to get specific password update time
    },
  );
  return null; // null bz we are updating a password field
};

// refresh token
const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //craeting new token for reseting password
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m', // user should complete reset within 10 minutes or else the token will expire
  );
  const resultUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`; // using this structure bz when deployed we can change the ui link
  //resultUILink will not be sent as response it will be sent in the provided email of user i.e student |faculty | admin || need to modify user interface as email is not present

  sendEmail(user.email, resultUILink); // as to and html
  console.log(user);
  console.log(user.email, resultUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }
  // validate user id get from token and payload id same or not. to ensure no user can reset password with another users email token
  //as reset token is created using assess_secret so it should be checked using assess_secret
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  console.log(decoded); // { userId: 'A-0002', role: 'admin', iat: 1735080779, exp: 1735081379 } // note:1 log admin-token > forget passtoken > give forget pass token in reset token header withing 10m or else it will not work
  if (payload.id !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden ! !');
  }
  ////hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    // must use findOneAndUpdate or will give error
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(), // add a field in model to get specific password update time
    },
  );
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
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
