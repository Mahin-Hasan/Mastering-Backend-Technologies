import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-semester-registration',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidatoinSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  SemesterRegistrationController.getSingleSemesterRegistration,
);
router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),

  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidatoinSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);
router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  SemesterRegistrationController.getAllSemesterRegistration,
);

//delete should not be used as other model are depended in semester registration
router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SemesterRegistrationController.deleteSemesterRegistration,
);
export const semesterRegistrationRoutes = router;
