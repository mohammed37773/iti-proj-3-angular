export type Role= "admin" | "doctor" | "patient"

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}
