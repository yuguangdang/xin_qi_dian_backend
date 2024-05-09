import { Request, Response } from "express";
import { Student } from "../models/Student";
import { Tutor } from "../models/Tutor";

export const bookSession = async (req: Request, res: Response) => {
  const { studentId, tutorId, slots } = req.body;
  try {
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).send({ message: "Tutor not found" });
    }

    let slotsToBook = [];

    // Check if all requested slots can be booked
    for (const requestedSlot of slots) {
      const start = new Date(requestedSlot.startTime);
      const end = new Date(requestedSlot.endTime);

      const slotToUpdate = tutor.availableSlots.find(
        (slot) =>
          new Date(slot.startTime).getTime() === start.getTime() &&
          new Date(slot.endTime).getTime() === end.getTime() &&
          !slot.isBooked
      );

      if (!slotToUpdate) {
        // If any slot cannot be booked, fail the entire request
        return res.status(400).send({
          message: "One or more slots are already booked or not available.",
        });
      }

      slotsToBook.push(slotToUpdate);
    }

    // If all slots can be booked, proceed to book them
    slotsToBook.forEach((slot) => {
      slot.isBooked = true;
      slot.bookedBy = studentId;
    });

    await tutor.save();

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    // Add the booking details to the student's booked sessions
    slotsToBook.forEach((slot) => {
      student.bookedSessions.push({
        tutorId: tutor._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    });

    await student.save();

    res.send({
      message: "All requested sessions booked successfully",
      slots: slotsToBook,
    });
  } catch (error) {
    res.status(500).send({ error: "Failed to book session(s)" });
  }
};

export const cancelSession = async (req: Request, res: Response) => {
  const { studentId, tutorId, slots } = req.body;
  try {
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).send({ message: "Tutor not found" });
    }

    let slotsToCancel = [];

    // Check if all requested slots can be cancelled
    for (const requestedSlot of slots) {
      const start = new Date(requestedSlot.startTime);
      const end = new Date(requestedSlot.endTime);

      const slotToUpdate = tutor.availableSlots.find(
        (slot) =>
          new Date(slot.startTime).getTime() === start.getTime() &&
          new Date(slot.endTime).getTime() === end.getTime() &&
          slot.isBooked &&
          slot.bookedBy?.toString() === studentId
      );

      if (!slotToUpdate) {
        // If any slot cannot be cancelled, fail the entire request
        return res.status(400).send({
          message: "One or more slots cannot be cancelled.",
        });
      }

      slotsToCancel.push(slotToUpdate);
    }

    // If all slots can be cancelled, proceed to cancel them
    slotsToCancel.forEach((slot) => {
      slot.isBooked = false;
      slot.bookedBy = undefined;
    });

    await tutor.save();

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    // Remove the booking details from the student's booked sessions
    slotsToCancel.forEach((slot) => {
      student.bookedSessions = student.bookedSessions.filter(
        (session) =>
          session.tutorId.toString() !== tutorId &&
          new Date(session.startTime).getTime() !==
            new Date(slot.startTime).getTime() &&
          new Date(session.endTime).getTime() !==
            new Date(slot.endTime).getTime()
      );
    });

    await student.save();

    res.send({
      message: "All requested sessions cancelled successfully",
      slots: slotsToCancel,
    });
  } catch (error) {
    res.status(500).send({ error: "Failed to cancel session(s)" });
  }
};
