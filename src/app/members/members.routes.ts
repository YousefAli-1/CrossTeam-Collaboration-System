import { Routes } from "@angular/router";
import { MembersHomeComponent } from "./members-home/members-home.component";

export const membersRoutes: Routes=[
    {
        pathMatch:'full',
        path: '',
        redirectTo: 'homepage'
    },
    {
        path: 'homepage',
        component: MembersHomeComponent
    }
];