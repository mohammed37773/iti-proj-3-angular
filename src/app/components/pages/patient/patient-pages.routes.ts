import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },

      {
        path: "appointments",
        loadComponent: () => import("./patient-appointments/patient-appointments").then(c => c.PatientAppointments)
      },
      {
        path: "dashboard",
        loadComponent: () => import("./patient-dashboard/patient-dashboard").then(c => c.PatientDashboard)
      },
      {
        path: "records",
        loadComponent: () => import("./patient-records/patient-records").then(c => c.PatientRecords)
      },

      // ✅ user نفسه
      {
        path: "profile",
        loadComponent: () => import("./patient-profile/patient-profile").then(c => c.PatientProfile)
      },

      // 🔥 optional (admin view)
      {
        path: "profile/:id",
        loadComponent: () => import("./patient-profile/patient-profile").then(c => c.PatientProfile)
      }
    ]
  }
];