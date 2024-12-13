import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {},
);
const getAllSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {},
);
const getSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
  },
);
// be careful while updating
const updateSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
  },
);

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
};
