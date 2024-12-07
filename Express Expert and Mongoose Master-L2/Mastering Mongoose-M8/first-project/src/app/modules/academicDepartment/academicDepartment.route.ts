import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';


const router = express.Router();

router.post(
  '/create-academic-department',
  validateRequest(
    AcademicDepartmentValidations.createAcademicDepartmentValidatoinSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);

router.get('/:departmentId', AcademicDepartmentControllers.getSingleAcademicDepartment);

router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidatoinSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
);

export const AcademicDepartmentRoutes = router