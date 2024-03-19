import { Request, Response } from 'express';
import { Student } from '../models/Student';

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await Student.find({});
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send();
    }
    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).send();
    }
    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).send();
    }
    res.send(student);
  } catch (error) {
    res.status(500).send(error);
  }
};
