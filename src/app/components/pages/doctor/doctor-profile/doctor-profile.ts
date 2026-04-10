import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IDoctor } from '../../../../models/idoctor';

@Component({
  selector: 'app-doctor-profile',
  imports: [JsonPipe, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile implements OnInit {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  auth = inject(AuthService);
  router = inject(Router);
  form!: FormGroup;
  isLoading = false
  data = this.auth.getCurrentUserData() as IDoctor
  
  ngOnInit(): void {
    this.form = this.fb.group(
      {
        fullName: [this.data.name, [Validators.required, Validators.minLength(3)]],
        email: [this.data.email, [Validators.required, Validators.email]],
        phone: ['01234567890', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
        bio: [this.data.bio],
        experience: [this.data.experience],
      },
    );
  }

  onSubmit(){
    this.isLoading = true;

  }




}
