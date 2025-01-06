import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import { USER_ROLE, UserStatus } from './user.constant';

const userSchema = new Schema<TUser, UserModel>( // adding UserModel for validation
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      select: 0, // ensure password does not show in response | $$$$ NOTE: it will give error as it will fail to find password for other operation in the application
    },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date }, // to keep password change time
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'student', 'faculty'],
      // enum: Object.values(USER_ROLE),
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // by default created createdAt and updatedAt
  },
);

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next(); //dont show password as response
});

//creating statics to check User id isExist
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password'); // as key and value same to it can be written in short || $$$ NOTE: must use select or applicaiton will fail to match password | if + not added then needsPasswordChange will not show
};
//check password match using statics
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

//static to check if password is changed than previously created token will not work
//L2
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  // console.log(passwordChangedTimestamp, jwtIssuedTimestamp); // 2024-12-17T20:56:31.777Z |||| 1734468199
  // so need to convert to JWT iat format to perform check
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000; //do not import Date
  // console.log(passwordChangedTime, jwtIssuedTimestamp); 1734468991.777 1734468199
  // console.log(passwordChangedTime > jwtIssuedTimestamp); true
  return passwordChangedTime > jwtIssuedTimestamp; // functionality in auth.ts
};

export const User = model<TUser, UserModel>('User', userSchema); //adding UserModel for validation
