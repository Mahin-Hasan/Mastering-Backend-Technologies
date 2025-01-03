import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
//@ts-ignore
import httpStatus from 'http-status';
import { EnrolledCourseService } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  // console.log(req.user, 'USER');
  /*
    {
      userId: '2030010006',
      role: 'student',
      iat: 1735932284,
      exp: 1736018684
    } USER
*/
  const userId = req.user.userId;

  const result = await EnrolledCourseService.createEnrolledCourseIntoDB(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is enrolled Successfully',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
};
