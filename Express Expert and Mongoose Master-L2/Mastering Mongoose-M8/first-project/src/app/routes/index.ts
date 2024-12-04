import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { StudentRoute } from '../modules/student/student.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoute,
  },
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
];

// router.use('/users', UserRoutes);
// router.use('/students', StudentRoute);
//doing the same operation using forEach loop
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
