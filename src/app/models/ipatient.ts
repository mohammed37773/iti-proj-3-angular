import { IUser } from "./iuser";

export interface IPatient extends IUser {
    deactivated: boolean ;
}
