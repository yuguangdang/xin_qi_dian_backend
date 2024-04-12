import mongoose, { Document, Schema } from 'mongoose';

// Defining the Tutor interface
interface ITutor extends Document {
  name: string;
  subjects: string[];
  availableSlots: {
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    bookedBy?: mongoose.Types.ObjectId;
  }[];
  reviews: {
    studentId: mongoose.Types.ObjectId;
    review: string;
    rating: number;
    timestamp: Date;
  }[];
}

// Tutor schema definition
const TutorSchema: Schema = new Schema({
  name: { type: String },
  subjects: [{ type: String }],
  availableSlots: [{
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isBooked: { type: Boolean, default: false },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null }
  }],
  reviews: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    timestamp: { type: Date, default: Date.now }
  }]
});

export const Tutor = mongoose.model<ITutor>('Tutor', TutorSchema);
