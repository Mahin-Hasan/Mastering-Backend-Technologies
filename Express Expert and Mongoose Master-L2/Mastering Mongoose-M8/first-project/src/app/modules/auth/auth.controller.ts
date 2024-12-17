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

const changePassword = catchAsync(async (req, res) => {
  console.log(req.user, req.body); // from decoded user in auth.ts | output: undefined { oldPassword: 'student123', newPassword: 'student12345' } NOTE: undefined bz nothing given in route
  const { ...passwordData } = req.body;
  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {       
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated succesfully!',
    data: 'hahah',
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
};
