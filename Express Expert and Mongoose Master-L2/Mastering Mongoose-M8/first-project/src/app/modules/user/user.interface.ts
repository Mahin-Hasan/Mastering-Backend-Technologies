import { Model } from 'mongoose';

// export type TUser = {
export interface TUser {
  // using interface so that it can be extended
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'student' | 'faculty';
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
}
