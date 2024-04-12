import mongoose, { Document, Schema } from 'mongoose';

// Defining the Student interface
interface IStudent extends Document {
  name: string;
  subjectsOfInterest: string[];
  bookedSessions: {
    tutorId: mongoose.Types.ObjectId;
    slotId: mongoose.Types.ObjectId;
  }[];
}

// Student schema definition
const StudentSchema: Schema = new Schema({
  name: { type: String },
  subjectsOfInterest: [{ type: String }],
  bookedSessions: [{
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, required: true }
  }]
});

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
