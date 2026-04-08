import { CanMatchFn } from '@angular/router';
import { IUser } from '../models/iuser';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const isDoctorGuard: CanMatchFn = (route, segments) => {
 let auth = inject(AuthService)
  let currentUser = auth.getCurrentUserData()
  return currentUser.role == "doctor"
};
