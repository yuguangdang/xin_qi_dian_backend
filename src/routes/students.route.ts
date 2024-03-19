import express from 'express';
import * as StudentController from '../controllers/student.controller'

const router = express.Router();

// CRUD operations for students
router.post('/createStudent', StudentController.createStudent); 
router.get('/getAllStudents', StudentController.getAllStudents); 
router.get('/getStudentById/:id', StudentController.getStudentById); 
router.put('updateStudent/:id', StudentController.updateStudent); 
router.delete('deleteStudent/:id', StudentController.deleteStudent); 

export default router;
