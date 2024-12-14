import { Types } from "mongoose";

export type TSemesterRegistration = {
  academicSemester: Types.ObjectId;
  status: 'UPCOMING' | 'ONGOING' | 'ENDED';
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
};


// Functionality Business logic

/*
1. if semester upcoming or ongoing then do not allow regester
2. if the requested semester registration is ended, then we will not update anything
3. When semester is created it will be UPCOMING by default later it will follow the sequence UPCOMING -> ONGOING -> ENDED 
*/