import { IUser } from "./iuser";

interface IDoctor extends IUser {
  specialization: string;
  experience: number; // years
  bio: string;
  availableSlots: ITimeSlot[];
  rating: number;
  reviewCount: number;
}

interface ITimeSlot {
  day: string; // 'Monday', 'Tuesday', etc.
  startTime: string; // '09:00'
  endTime: string; // '09:30'
  isBooked: boolean;
}


