/*
// version one updateding based on only last added student id
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudnet = await User.findOne(
    {
      role: 'student',
    },
    {
      //field filtering
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean(); //makes query run faster || read documentation
  //203101 0001 // only increment the last 4 using substring
  return lastStudnet?.id ? lastStudnet.id.substring(6) : undefined;
};

//format year semestercode 4 digit number
export const generateStudentId = async (payload: TAcademicSemester) => {
  //   console.log(await findLastStudentId());
  //first time 0000
  const currentId = (await findLastStudentId()) || (0).toString(); // check id exist or not else put default value
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0'); // makes 0000 i.e (10).toString().padStart(4,'0') 0010

  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

*/
// version 2 // increment based on year change and semester change
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudnet = await User.findOne(
    {
      role: 'student',
    },
    {
      //field filtering
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean(); //makes query run faster || read documentation
  //2030 01 0001
  return lastStudnet?.id ? lastStudnet.id : undefined;
};

//format year semestercode 4 digit number
export const generateStudentId = async (payload: TAcademicSemester) => {
  //   console.log(await findLastStudentId());
  //first time 0000
  let currentId = (0).toString(); //default value 0000
  const lastStudentId = await findLastStudentId();

  //2030 01 0001
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6); // 01
  const lastStudentYear = lastStudentId?.substring(0, 4); // 2030
  const currentSemesterCode = payload.code;
  const currentYear = payload.year;

  //if condtion to check what is the last year and last enrolled semester

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6); // 0001
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0'); // makes 0000 i.e (10).toString().padStart(4,'0') 0010

  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

//generate faculty ID
// Faculty ID
export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `F-${incrementId}`;

  return incrementId;
};
