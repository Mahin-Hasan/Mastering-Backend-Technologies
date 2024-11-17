//handle routing

import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

//will call controller function

router.post('/create-student', StudentControllers.createStudent);
router.get('/', StudentControllers.getAllStudents);
router.get('/:studentId', StudentControllers.getSingleStudent);

export const StudentRoute = router; // as router itself is an object so we will directly export it
