import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IUser } from '../models/iuser';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router)
  currentUser = new BehaviorSubject<IUser | null>(null);
  role = this.currentUser.asObservable()
          .pipe(map(user => user?.role));

  logIn(email: string, password: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(environment.UserUrl + `?email=${email}&password=${password}`)
  }

  checkEmailExists(email: string): Observable<IUser[]> {
    return this.http.get<IUser[]>(environment.UserUrl + `?email=${email}`);
  }
  
  Authorize(user: IUser) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    this.currentUser.next(user);
  }
  getCurrentUserData(){
    return JSON.parse(localStorage.getItem("currentUser")??"{}")
  }

  logOut(){
    localStorage.removeItem("currentUser")
    this.currentUser.next(null)
    this.router.navigateByUrl("/login")
  }

}
