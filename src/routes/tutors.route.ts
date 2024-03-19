import express from 'express';
import * as TutorController from '../controllers/tutor.controller';

const router = express.Router();

// CRUD operations for tutors
router.post('/createTutor', TutorController.createTutor); 
router.get('/getAllTutors/', TutorController.getAllTutors); 
router.get('/getTutorById/:id', TutorController.getTutorById); 
router.put('/updateTutor/:id', TutorController.updateTutor); 
router.delete('/deleteTutor/:id', TutorController.deleteTutor); 
router.get('/getTutorAvailabilityById/:id', TutorController.getTutorAvailabilityById); 

export default router;
