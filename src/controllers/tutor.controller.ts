import { Request, Response } from 'express';
import { Tutor } from '../models/Tutor';

export const createTutor = async (req: Request, res: Response) => {
  try {
    const tutor = new Tutor(req.body);
    await tutor.save();
    res.status(201).send(tutor);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAllTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await Tutor.find({});
    res.send(tutors);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getTutorById = async (req: Request, res: Response) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).send();
    }
    res.send(tutor);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateTutor = async (req: Request, res: Response) => {
  try {
    const tutor = await Tutor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tutor) {
      return res.status(404).send();
    }
    res.send(tutor);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteTutor = async (req: Request, res: Response) => {
  try {
    const tutor = await Tutor.findByIdAndDelete(req.params.id);
    if (!tutor) {
      return res.status(404).send();
    }
    res.send(tutor);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getTutorAvailabilityById = async (req: Request, res: Response) => {
  try { 
    const tutorId = req.params.id; // Assuming the ID is passed as part of the URL
    const tutor = await Tutor.findById(tutorId, 'availableSlots'); // Select only the availableSlots field

    if (!tutor) {
      return res.status(404).send({ message: 'Tutor not found.' });
    }

    // Optionally, filter out past slots or fully booked slots based on your requirements
    const availability = tutor.availableSlots.filter(slot => {
      // Example filter: only future slots and not booked
      return slot.startTime > new Date() && !slot.isBooked;
    });

    res.send({ availability });
  } catch (error) {
    res.status(500).send(error);
  }
};





