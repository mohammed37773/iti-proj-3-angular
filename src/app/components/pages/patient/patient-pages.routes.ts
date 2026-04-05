import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "patient",
        redirectTo: "profile",
        children: [
            {

                path: "appointment",
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
            {
                path: "profile",
                loadComponent: () => import("./patient-profile/patient-profile").then(c => c.PatientProfile)
            }

        ]
    }
];
