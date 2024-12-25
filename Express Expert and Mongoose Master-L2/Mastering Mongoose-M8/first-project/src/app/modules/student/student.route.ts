//handle routing

import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidatoins } from './student.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

//will call controller function

// router.post('/create-student', StudentControllers.createStudent); | moved to users route
//routes for custom student generated Id
// router.get('/', StudentControllers.getAllStudents);
// router.get('/:studentId', StudentControllers.getSingleStudent);
// router.delete('/:studentId', StudentControllers.deleteStudent);
// router.patch('/:studentId',validateRequest(studentValidatoins.updateStudentValidatoinSchemaZod), StudentControllers.updateStudent); // Update API

// routes for mongodb generated ID
router.get('/', StudentControllers.getAllStudents);
router.get(
  '/:id',
  auth('student', 'admin', 'faculty'), // for student it will work only if logged user token id matches with collection id || i.e me route || akjon student onnojon er data access korte parbe nah
  StudentControllers.getSingleStudent,
);
router.delete('/:id', StudentControllers.deleteStudent);
router.patch(
  '/:id',
  validateRequest(studentValidatoins.updateStudentValidatoinSchemaZod),
  StudentControllers.updateStudent,
); // Update API

//trying update
//router.put('/:studentId', StudentControllers.updateStudent); // Update API

export const StudentRoute = router; // as router itself is an object so we will directly export it
