import { Schema, model } from 'mongoose';
import validator from 'validator';

import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from './student/student.interface';
// NOTE: As we are using JOI validation library so we can remove all validator functions

// Sub-schema for cleaner code
const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required.'], // Custom error message for required
    trim: true, // will remove all additional space ex "   Mahin   " will become "Mahin"
    maxlength: [20, 'First Name cannot be more than 20 character'], // will not accept more than 20 letters with custom message
    validate: {
      validator: function (value) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: '{VALUE} is not in capitalize format',
    }, // custom func with custom message
    // validate: function (value) {
    //   console.log(value); // will get sent data as value
    //   const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1); //Mahin
    //   console.log(firstNameStr,value); // output: MaHIn maHIn
    //   return firstNameStr === value;
    //   //same above code
    //   // if (value !== firstNameStr) {
    //   //   return false;
    //   // }
    //   // return true;

    // }, // this is a custom function for validatoin we will use regular fuction rather than arrow function bz we might need to use this.in future
  }, // here trim | maxlength are built in validator
  middleName: { type: String, trim: true },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last name is required.'],
    validate: {
      validator: (value: string) => validator.isAlpha(value), // validating using validator
      message: '{VALUE} is not valid',
    },
  }, // Custom error message for required
});

const guardianSchema = new Schema<Guardian>({
  fatherName: { type: String, required: [true, 'Father name is required.'] },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation is required.'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father contact number is required.'],
  },
  motherName: { type: String, required: [true, 'Mother name is required.'] },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required.'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother contact number is required.'],
  },
});
const localGuardianSchema = new Schema<LocalGuardian>({
  name: { type: String, required: [true, 'Local guardian name is required.'] },
  occupation: {
    type: String,
    required: [true, 'Local guardian occupation is required.'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian contact number is required.'],
  },
  address: {
    type: String,
    required: [true, 'Local guardian address is required.'],
  },
});

// Main schema
const studentSchema = new Schema<Student>({
  id: {
    type: String,
    required: [true, 'Student ID is required.'],
    unique: true,
  }, // Ensures unique ID
  name: {
    type: userNameSchema,
    required: [true, 'Student name details are required.'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not a valid gender.', // Custom error message for enum value
    },
    required: [true, 'Gender is required.'], // Custom error message for required
  },
  dateOfBirth: { type: String },
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email type',
    },
  },
  contactNo: { type: String, required: [true, 'Contact number is required.'] },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact number is required.'],
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required.'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required.'],
  },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian details are required.'],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, 'Local guardian details are required.'],
  },
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active', // Default value for new entries
  },
});

// Creating model
// const Student = model<Student>('Student', studentSchema); // Student name should be similar
export const StudentModel = model<Student>('Student', studentSchema); // Ensures consistency with MongoDB collection naming

// My types code

/*
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

*/
