import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface to define the User model structure
interface IUser extends Document {
  email: string;
  password: string;
  role: 'student' | 'tutor';
  profileId?: Schema.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Always store emails in lowercase to avoid case-sensitive issues
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['student', 'tutor'],
  },
  profileId: {
    type: Schema.Types.ObjectId,
    refPath: 'role', // Dynamically determine the collection to reference based on the 'role' field
  },
});

// Pre-save hook to hash the password before saving it to the database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // Hash the password with a salt round of 8
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

const User = model<IUser>('User', userSchema);

export default User;
