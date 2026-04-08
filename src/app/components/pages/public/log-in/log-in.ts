import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../../services/auth-service';
import { IUser } from '../../../../models/iuser';

@Component({
  selector: 'app-log-in',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
})
export class LogIn implements OnInit {
  fb: FormBuilder = inject(FormBuilder)
  http = inject(HttpClient);
  auth = inject(AuthService);
  router = inject(Router)
  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ["ahmed@doctor.com", [Validators.required, Validators.email]],
      password: ["doctor123", [Validators.required, Validators.minLength(4)]]
    })
  }

  onSubmit(): void {   
    this.auth.logIn(this.form.get("email")?.value!, this.form.get("password")?.value!).subscribe({
        next: (res: IUser[]) => {
          if (res && res.length > 0) {
            const user = res[0];
            this.auth.Authorize(user);
            this.router.navigateByUrl("/")
          } else {
            console.log('No user found');
          }
        },
        error: (err) => {
          console.log('Login failed:', err);
        }
    })
  }
}


