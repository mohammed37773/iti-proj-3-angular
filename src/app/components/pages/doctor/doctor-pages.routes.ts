import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "doctor",
        redirectTo: "profile",
        children: [
            {

                path: "appointment",
                loadComponent: () => import("./doctor-appointments/doctor-appointments").then(c => c.DoctorAppointments)

            },
            {
                path: "dashboard",
                loadComponent: () => import("./doctor-dashboard/doctor-dashboard").then(c => c.DoctorDashboard)

            },
            {
                path: "history/:patientId",
                loadComponent: () => import("./doctor-history/doctor-history").then(c => c.DoctorHistory)
            },
            {
                path: "prescription",
                loadComponent: () => import("./doctor-prescriptions/doctor-prescriptions").then(c => c.DoctorPrescriptions)
            },
            {
                path: "profile",
                loadComponent: () => import("./doctor-profile/doctor-profile").then(c => c.DoctorProfile)
            }

        ]
    }
];
