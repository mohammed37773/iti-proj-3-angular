import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: "login",
        loadComponent: () => import("./log-in/log-in").then(c => c.LogIn)

    },
    {
        path: "register",
        loadComponent: () => import("./register/register").then(c => c.Register)

    },
    {
        path: "search",
        loadComponent: () => import("./doctors/doctors").then(c => c.Doctors)
    },
    {
        path: "doctors/:id",
        loadComponent: () => import("./doctor-details/doctor-details").then(c => c.DoctorDetails)
    }
];
