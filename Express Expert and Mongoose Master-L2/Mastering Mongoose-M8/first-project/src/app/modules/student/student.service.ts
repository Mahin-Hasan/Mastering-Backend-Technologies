import { Student } from './student.model';
import { TStudent } from './student.interface';

/*refactoring to user service
const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await StudentModel.create(student); // build in static method

  //calling out custom static || better to call before creating
  if (await Student.isUserExists(studentData.id)) {
    throw new Error('User already Exists');
  }
  const result = await Student.create(studentData); // as StudentModel changed to Student

  /*  
  const student = new Student(studentData); // create an instance

  //calling out custom instance | await must be used as we are using Query to find id
  if (await student.isUserExists(studentData.id)) {
    throw new Error('User already Exists');
  } //our created custom instance must be passed in model.ts
  const result = await student.save(); // build in instance method

  / add *

  return result;
};


*/

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};
const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id }); // note: StudentModel name changed to Student

  //doing the same operation using aggregate pipe line
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};
const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true }); // we will call update bz it will create an incostincy in database
  return result;
};

//trying update
const updateStudentInDB = async (id: string, updateData: Partial<TStudent>) => {
  // Check if the student exists
  const existingStudent = await Student.findOne({ id });
  if (!existingStudent) {
    throw new Error('Student not found');
  }

  // Update the student data
  const updatedStudent = await Student.findOneAndUpdate(
    { id },
    { $set: updateData },
    { new: true, runValidators: true }, // Return the updated document and validate the update
  );

  return updatedStudent;
};

export const StudentServices = {
  // createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentInDB,
};
