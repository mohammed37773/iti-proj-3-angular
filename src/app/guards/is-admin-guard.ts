import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { IUser } from '../models/iuser';


export const isAdminGuard: CanMatchFn = (route, segments) => {
  let auth = inject(AuthService)
  let currentUser = auth.getCurrentUserData()
    return currentUser.role == "admin"
};
