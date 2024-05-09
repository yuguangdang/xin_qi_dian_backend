import mongoose, { Document, Schema } from 'mongoose';

// Defining the Student interface
interface IStudent extends Document {
  name: string;
  subjectsOfInterest: string[];
  bookedSessions: {
    tutorId: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
  }[];
}


const StudentSchema: Schema = new Schema({
  name: { type: String, required: true },
  subjectsOfInterest: [{ type: String, required: true }],
  bookedSessions: [{
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }
  }]
});

export const Student = mongoose.model<IStudent>('Student', StudentSchema);

