import { IUser } from "./iuser";

export interface IDoctor extends IUser {
  specialization: string;
  experience: number; // years
  bio: string;
  availableSlots: ITimeSlot[];
  rating: number;
  reviewCount: number;
}

export interface ITimeSlot {
  day: string; 
  startTime: string; 
  endTime: string; 
  isBooked: boolean;
}


