// @ts-ignore
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { SemesterRegistrationService } from './semesterRegistration.service';
import sendResponse from '../../utils/sendResponse';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationService.createSemesterRegistrationIntoDB(
        req.body,
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration is created sucessfully',
      data: result,
    });
  },
);
const getAllSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationService.getAllSemesterRegistrationFromDB(
        req.query,
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration is retrived sucessfully',
      data: result,
    });
  },
);
const getSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result =
      await SemesterRegistrationService.getSingleSemesterRegistrationFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Semester Registration is retrived sucessfully',
      data: result,
    });
  },
);
// be careful while updating
const updateSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationService.updateSemesterRegistrationIntoDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration is updated sucessfully',
      data: result,
    });
  },
);

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
};
