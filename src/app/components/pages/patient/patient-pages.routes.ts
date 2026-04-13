import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    children: [
      { path: "", redirectTo: "appointments", pathMatch: "full" },

      {
        path: "appointments",
        loadComponent: () =>
          import("./patient-appointments/patient-appointments")
            .then(c => c.PatientAppointments)
      },

      {
        path: "records",
        loadComponent: () =>
          import("./patient-records/patient-records")
            .then(c => c.PatientRecords)
      },

      {
        path: "profile",
        loadComponent: () =>
          import("./patient-profile/patient-profile")
            .then(c => c.PatientProfile)
      },

      {
        path: "profile/:id",
        loadComponent: () =>
          import("./patient-profile/patient-profile")
            .then(c => c.PatientProfile)
      }
    ]
  }
];