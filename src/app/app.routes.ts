import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadChildren: ()=>import("./components/pages/public/general-pages.routes").then(r => r.routes)
    },
    {
        path: "admin",
        loadChildren: ()=>import("./components/pages/admin/admin-pages.routes").then(r => r.routes)
    },
    {
        path: "patient",
        loadChildren: ()=>import("./components/pages/patient/patient-pages.routes").then(r => r.routes)
    },
    {
        path: "doctor",
        loadChildren: ()=>import("./components/pages/doctor/doctor-pages.routes").then(r => r.routes)
    },


    {
        path: "**",
        loadComponent: () => import("./components/pages/public/not-found/not-found").then(c => c.NotFound)

    }


];
