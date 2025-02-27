import { Model, Types } from 'mongoose';

//while using zod it will also find out type error from interface as well | duplication error arise in StudentModel in model so add T in front using F2
//modular pattern
// interface - schema - model - dbQuery

// 1. interface
export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};
export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};
export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  password: string; //SecurePassword hashed pass
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  // isActive: 'active' | 'blocked';
  admissionSemester: Types.ObjectId; // ObjectId Ref for academic semester
  academicDepartment: Types.ObjectId; // ObjectId Ref for academic Department
  academicFaculty: Types.ObjectId; // ObjectId Ref for academic Faculty
  isDeleted: boolean;
};

//2. scema

//for creating custom static method
export interface StudentModel extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>;
}

//creating a custom instance method student method to check whether data exists or not
/*
export type StudentMethods = {
  isUserExists(id: string): Promise<TStudent | null>;
};

// it will be imported in Model
export type StudentModel = Model<
  TStudent,
  Record<string, never>,
  StudentMethods
>;
*/
