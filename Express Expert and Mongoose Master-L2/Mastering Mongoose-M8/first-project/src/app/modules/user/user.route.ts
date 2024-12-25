import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidatoins } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
  '/create-student',
 auth(USER_ROLE.admin), //must be admin in order to create student USER_ROLE.admin|  as auth() is added ensure to add send token to create student Header
  validateRequest(studentValidatoins.createStudentValidatoinSchemaZod),
  UserControllers.createStudent,
);
router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);
router.post(
  '/create-admin',
  // auth(USER_ROLE.admin), | turn on when we will have a super admin
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

// this route is creted to ensure proper security in get single student when this route is hit by student token, as a logged student can only view his her details but for admin and faculty they have full access to all students records
router.get('/me', auth('student', 'faculty', 'admin'), UserControllers.getMe);


export const UserRoutes = router;

//whitout HOF - higher order function
// const guardPost = (req: Request, res: Response, next: NextFunction) => {
//   console.log(req.body);
//   console.log('guard middleware ');
//  next() /// pass to controller or next middleware
// };
