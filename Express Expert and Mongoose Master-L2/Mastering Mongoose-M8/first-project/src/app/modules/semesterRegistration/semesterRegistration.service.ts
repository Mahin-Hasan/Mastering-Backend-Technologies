// @ts-ignore
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  //Check if semester exist or not || This can be done using STATIC, SAVE pre Middleware, also in service
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academic semester is not found',
    );
  }

  //check is the semester is already registered or not || NOTE: findOne bz it is SemesterRegistration Model
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester, // if key and value is same then writing it one time will be enough
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This semester is alerady registered!!!',
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};
const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};
const getSingleSemesterRegistrationFromDB = async (id: String) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};
const updateSemesterRegistrationIntoDB = async (id: string) => {
    
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
};
