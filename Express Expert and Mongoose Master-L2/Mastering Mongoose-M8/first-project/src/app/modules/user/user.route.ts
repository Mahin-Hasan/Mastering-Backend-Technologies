import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidatoins } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidatoins.createStudentValidatoinSchemaZod),
  UserControllers.createStudent,
);

export const UserRoutes = router;

//whitout HOF - higher order function
// const guardPost = (req: Request, res: Response, next: NextFunction) => {
//   console.log(req.body);
//   console.log('guard middleware ');
//  next() /// pass to controller or next middleware
// };
