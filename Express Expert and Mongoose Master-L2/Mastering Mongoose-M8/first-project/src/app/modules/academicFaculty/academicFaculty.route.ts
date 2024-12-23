import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidations } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    AcademicFacultyValidations.createAcademicFacultyValidatoinSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/',auth(), AcademicFacultyControllers.getAllAcademicFaculties);

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicFaculty);

router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidations.updateAcademicFacultyValidatoinSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
);

export const AcademicFacultyRoutes = router