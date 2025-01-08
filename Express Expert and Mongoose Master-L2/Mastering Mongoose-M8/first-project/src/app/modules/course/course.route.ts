import express from 'express';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-course',
  auth('superAdmin', 'admin'), // can be written as  auth(USER_ROLE.admin)
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  CourseControllers.getSingleCourse,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  CourseControllers.deleteCourse,
);
router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);
//put used for specific purpose | ie. if exist than update if does not exist then create
router.put(
  '/:courseId/assign-faculties',
  auth('superAdmin', 'admin'),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);
router.get(
  '/:courseId/get-faculties',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  CourseControllers.getFacultiesWithCourse,
);

//remove faculties route
router.delete(
  '/:courseId/remove-faculties',
  auth('superAdmin', 'admin'),
  validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  CourseControllers.getAllCourses,
);

export const CourseRoutes = router;
