import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import { studentValidatoins } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

//with image upload
router.post(
  '/create-student',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'), // as in upload we are using file to give image so we need to create a middleware that will parse image and text to json format for validate request middleware
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data); // as passed in form data
    next(); // must call next function or else it will not got to next middleware
  },
  //must be admin in order to create student USER_ROLE.admin|  as auth() is added ensure to add send token to create student Header
  validateRequest(studentValidatoins.createStudentValidatoinSchemaZod),
  UserControllers.createStudent,
);
//without image upload
// router.post(
//   '/create-student',
//  auth(USER_ROLE.admin), //must be admin in order to create student USER_ROLE.admin|  as auth() is added ensure to add send token to create student Header
//   validateRequest(studentValidatoins.createStudentValidatoinSchemaZod),
//   UserControllers.createStudent,
// );
router.post(
  '/create-faculty',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data); // as passed in form data
    next(); // must call next function or else it will not got to next middleware
  },
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);
router.post(
  '/create-admin',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),// as we are in developement mode we are giving access to admin to create an admin 
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data); // as passed in form data
    next(); // must call next function or else it will not got to next middleware
  },
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);
//for setting user status blocked or in-progress | when blocked the studnet user cannot login
router.post(
  '/change-status/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

// this route is creted to ensure proper security in get single student when this route is hit by student token, as a logged student can only view his her details but for admin and faculty they have full access to all students records
router.get(
  '/me',
  auth('superAdmin', 'student', 'faculty', 'admin'), // change if error
  UserControllers.getMe,
);

export const UserRoutes = router;

//whitout HOF - higher order function
// const guardPost = (req: Request, res: Response, next: NextFunction) => {
//   console.log(req.body);
//   console.log('guard middleware ');
//  next() /// pass to controller or next middleware
// };
