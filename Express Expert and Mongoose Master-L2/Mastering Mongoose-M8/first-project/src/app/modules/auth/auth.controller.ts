import catchAsync from '../../utils/catchAsync';
// @ts-ignore
import httpStatus from 'http-status';
import { AuthServices } from './auth.service';
import sendResponse from '../../utils/sendResponse';
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
};
