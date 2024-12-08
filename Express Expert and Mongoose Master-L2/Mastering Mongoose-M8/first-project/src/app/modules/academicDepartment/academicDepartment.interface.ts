import { Types } from 'mongoose';

export type TAcademicDepartment = {
  name: string;
  academicFaculty: Types.ObjectId;
};


/*
Functionality
1. same naam e 2 ta department create kora jave na
  --- add 2 layer checkin -> 1. done in model. ts setting name as unique which creates an index. 2. using mongoose middleware or query on controller
*/