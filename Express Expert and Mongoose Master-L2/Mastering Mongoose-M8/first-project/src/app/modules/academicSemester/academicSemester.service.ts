import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester, TAcademicSemesterNameCodeMapper } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // semester name --> semester code || functionality 2
  // we will not this type to declare mapped types
  //   type TAcademicSemesterNameCodeMapper = {
  //     Autumn: '01';
  //     Summar: '02';
  //     Fall: '03';
  //   };

  //using mapped types declared in interface || code refactored to constant


  //academicSemesterNameCodeMapper['Fall'] -> ie 3 !== sent code in apiDog ex 02 is given then it will give error
  if(academicSemesterNameCodeMapper[payload.name] !== payload.code){
    throw new Error('Invalid Semester Code')
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
};
