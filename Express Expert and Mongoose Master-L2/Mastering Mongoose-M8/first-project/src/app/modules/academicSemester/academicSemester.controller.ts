import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

// @ts-ignore
import httpStatus from 'http-status';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester is created successfully',
    data: result,
  });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semesters are retrived sucessfully',
    data: result,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const AcademicSemesterId = req.params.semesterId;
  const result =
    await AcademicSemesterServices.getSingleAcademicSemesterFromDB(
      AcademicSemesterId,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Academic Semester is retrived sucessfully',
    data: result,
  });
});

const updateAcademicSemester = catchAsync(async(req,res)=>{
  const {semesterId}= req.params
  const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(semesterId,req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Academic Semester is updated sucessfully',
    data: result,
  });
})

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester
};
