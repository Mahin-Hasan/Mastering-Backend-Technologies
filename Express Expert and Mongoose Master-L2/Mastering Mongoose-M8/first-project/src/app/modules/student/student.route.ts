//handle routing

import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidatoins } from './student.validation';

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
router.get('/:id', StudentControllers.getSingleStudent);
router.delete('/:id', StudentControllers.deleteStudent);
router.patch(
  '/:id',
  validateRequest(studentValidatoins.updateStudentValidatoinSchemaZod),
  StudentControllers.updateStudent,
); // Update API

//trying update
//router.put('/:studentId', StudentControllers.updateStudent); // Update API

export const StudentRoute = router; // as router itself is an object so we will directly export it
