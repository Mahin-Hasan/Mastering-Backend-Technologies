import { model, Schema } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    maxLength: [20,'name too long'],
    minLength: [3,'Name is too short'],
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
  },
  photo: String,
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: '{VALUE} is not a valid. please provide a valid user',
    },
    required: true,
  },
  userStatus: { type: String, enum: ['active', 'inactive'], required: true },
});

const User = model('User', userSchema);
export default User;
