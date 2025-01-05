import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

// export type TUser = {
export interface TUser {
  // using interface so that it can be extended
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date; // must declare
  role: 'super-admin' | 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  // myStaticMethod(): number;
  isUserExistsByCustomId(id: string): Promise<TUser>; // as it is a asynchronus operation so it will return a promise | isUserExistsByCustomId this is a function defination , needs to be created in user model
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: Number,
  ): boolean; // jwt format: iat: 1734468946
}
export type TUserRole = keyof typeof USER_ROLE;
