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
