import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import { SemesterRegistrationController } from './semesterRegistration.controller';

const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidatoinSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);
router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration,
);
router.patch('/:id', SemesterRegistrationController.updateSemesterRegistration);
router.get('/', SemesterRegistrationController.getAllSemesterRegistration);

//delete should not be used as other model are depended in semester registration

export const semesterRegistrationRoutes = router;
