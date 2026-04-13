import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./admin-appointments/admin-appointments').then((c) => c.AdminAppointments),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin-dashboard/admin-dashboard').then((c) => c.AdminDashboard),
      },
      {
        path: 'doctors',
        loadComponent: () => import('./admin-doctors/admin-doctors').then((c) => c.AdminDoctors),
      },
      {
        path: 'doctors/edit/:id',
        loadComponent: () =>
          import('./admin-edit-doctor/admin-edit-doctor/admin-edit-doctor').then((c) => c.AdminEditDoctor),
      },
      {
        path: 'patients',
        loadComponent: () => import('./admin-patients/admin-patients').then((c) => c.AdminPatients),
      },
    ],
  },
];
