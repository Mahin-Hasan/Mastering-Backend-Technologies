import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { StudentRoute } from '../modules/student/student.route';

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
];

// router.use('/users', UserRoutes);
// router.use('/students', StudentRoute);
//doing the same operation using forEach loop
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
