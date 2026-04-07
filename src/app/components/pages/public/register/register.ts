import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthService } from '../../../../services/auth-service';
import { IUser, Role } from '../../../../models/iuser';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  auth = inject(AuthService);
  router = inject(Router);
  form!: FormGroup;
  isLoading = false;
  emailExistsError = '';
  emailControl?: AbstractControl;

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['Ahmed', [Validators.required, Validators.minLength(3)]],
      email: ['ahmed@doctor.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
      password2: ['123456', [Validators.required, Validators.minLength(6)]],
      phone: ['01234567890', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
      role: ['doctor', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.emailControl = this.form.get('email')!;
    this.emailControl.valueChanges.subscribe(() => {
      this.emailExistsError = '';
    });
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const password2 = group.get('password2')?.value;
    return password === password2 ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.emailExistsError = '';
    this.isLoading = true;
    const formValue = this.form.value;
    const userData: IUser = {
      id: Date.now().toString(),
      name: formValue.fullName,
      email: formValue.email,
      password: formValue.password,
      phone: formValue.phone,
      role: formValue.role ? "doctor": "patient",
      createdAt: new Date().toISOString()
    };

    this.auth.checkEmailExists(formValue.email).subscribe({
      next: (users: IUser[]) => {
        if (users.length > 0) {
          this.emailExistsError = 'Email already exists. Please choose another.';
          this.isLoading = false;
          return;
        }

        // Register new user
        this.http.post(environment.AuthUrl, userData).subscribe({
          next: () => {
            this.auth.Authorize(userData);
            this.router.navigateByUrl(`/${userData.role}`)
          },
          error: (err) => {
            console.error('Registration failed:', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Email check failed:', err);
        this.isLoading = false;
      }
    });
  }
}
