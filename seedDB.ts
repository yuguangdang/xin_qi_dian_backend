import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Student } from './src/models/Student'; 
import { Tutor } from './src/models/Tutor'; 


dotenv.config();

const mongoConnectionString = process.env.MONGODB_CONNECTION_STRING as string;

mongoose.connect(mongoConnectionString)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


const seedDb = async () => {
  try {
    await Tutor.deleteMany({});
    await Student.deleteMany({});

    // Create a test tutor
    const tutor = new Tutor({
      name: "Test Tutor",
      email: "testtutor@example.com",
      password: "password", // Ideally, passwords should be hashed
      subjects: ["Math"],
      availableSlots: generateAvailabilitySlots(),
      reviews: [],
    });

    await tutor.save();

    // Create a test student
    const student = new Student({
      name: "Test Student",
      email: "teststudent@example.com",
      password: "password",
      subjectsOfInterest: ["Math"],
      bookedSessions: [],
    });

    await student.save();

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.disconnect();
  }
};

interface Slot {
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
  }
  
  const generateAvailabilitySlots = (): Slot[] => {
    const slots: Slot[] = [];
    const startTimes = [17, 18, 19, 20]; // 5 PM to 9 PM
    const days = [1, 3, 5]; // Monday, Wednesday, Friday
  
    const feb2024 = new Date('2024-02-01T00:00:00Z');
    for (let day = 1; day <= 28; day += 1) { // Start from day 1 of February
      const date = new Date(feb2024.getFullYear(), feb2024.getMonth(), day);
      if (days.includes(date.getDay())) {
        startTimes.forEach(hour => {
          const startTime = new Date(date.setHours(hour, 0, 0, 0));
          const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes later
          slots.push({ startTime, endTime, isBooked: false });
        });
      }
    }
    return slots;
  };
  

seedDb();
