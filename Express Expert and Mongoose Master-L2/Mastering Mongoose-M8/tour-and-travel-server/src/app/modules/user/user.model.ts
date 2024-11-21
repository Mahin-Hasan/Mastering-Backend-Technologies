import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    maxLength: [20, 'name too long'],
    minLength: [3, 'Name is too short'],
  },
  age: { type: Number, required: [true, 'Please enter your age'] },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    validate: {
      validator: function (value: string) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
      message: '{VALUE} is not a valid email',
    },
    immutable:true,// email er value asholeo update korbe na part 5 23min
  },
  photo: String,
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: '{VALUE} is not a valid. please provide a valid user',
    },
    default: 'user', //setting role as user by default 
    required: true,
  },
  userStatus: { type: String, enum: ['active', 'inactive'], required: true },
});

//pre hook

const User = model<IUser>('User', userSchema);
export default User;
