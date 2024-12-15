import { Types } from 'mongoose';

export type TDays = 'Sat' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

// referencing multiple fields so that we can search faster and we also want to update fronend data based on user selected fields
export type TOfferedCourse = {
  semesterRegistration: Types.ObjectId;
  academicSemester?: Types.ObjectId; // optional bz we will not send academicSemester from frontEnd andacademicSemester is already present in semesterRegistration model
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  maxCapacity: number;
  section: number;
  days: TDays[]; // enum | array must be declared
  startTime: string;
  endTime: string;
};

//for checking conflict
export type TSchedule = {
  days: TDays[];
  startTime: string;
  endTime: string;
};
