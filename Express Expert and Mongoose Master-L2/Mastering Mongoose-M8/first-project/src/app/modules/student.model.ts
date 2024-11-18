import { Schema, model } from 'mongoose';
import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from './student/student.interface';

//sub schema for cleaner code
const userNameSchema = new Schema<UserName>({
  firstName: { type: String, required: [true, 'First name must be provided'] }, // for setting up custom error message
  middleName: { type: String },
  lastName: { type: String, required: [true, 'Last name must be provided'] },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
});
const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

//main schema
const studentSchema = new Schema<Student>({
  id: { type: String, required: true, unique: true }, // unique true does not allow duplcate
  name: {
    type: userNameSchema,
    required: true,
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not valid', // if we want to get user sent method and then send custom error message
      //  message: "The gender field can only be one of the following 'male','female', or 'other'", // for enum custom message it should be given in value | message syntax //custom error message for value
    },
    required: [true, 'Gender field must be provided'], // custom error msg for field
  },
  dateOfBirth: { type: String },
  email: { type: String, required: true, unique: true },
  contactNo: { type: String, required: true },
  emergencyContactNo: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  guardian: {
    type: guardianSchema,
    required: true,
  },
  localGuardian: {
    type: localGuardianSchema,
    required: true,
  },
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active', // setting default value as active while creating
  },
});

// creating model

// const Student = model<Student>('Student', studentSchema); // Student name should be similar
export const StudentModel = model<Student>('Student', studentSchema); // Changing student name as it is conflicting in service ts but keeping (student) same as it will create in database | i.e this Student name is changed by mongodb to Students
