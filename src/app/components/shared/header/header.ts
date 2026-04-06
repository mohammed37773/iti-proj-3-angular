import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../services/auth-service';
import { map } from 'rxjs';
import { AsyncPipe, TitleCasePipe } from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe, TitleCasePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  auth = inject(AuthService);
  role = this.auth.currentUser.asObservable()
        .pipe(map(user => user?.role))

 logOut(){
  this.auth.logOut()
 }
}
