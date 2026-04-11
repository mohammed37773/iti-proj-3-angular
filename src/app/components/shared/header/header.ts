import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../../services/auth-service';
import { map } from 'rxjs';
import { AsyncPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe, TitleCasePipe, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true
})
export class Header {
  auth = inject(AuthService);
  role = this.auth.role;
  
  isNavOpen = signal(false);

  toggleNav() {
    this.isNavOpen.update(state => !state);
  }

  logOut(){
    this.auth.logOut();
    this.isNavOpen.set(false);
  }
}
