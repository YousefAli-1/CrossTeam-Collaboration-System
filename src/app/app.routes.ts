import { Routes } from '@angular/router';
import { MembersComponent } from './members/members.component';
import { membersRoutes } from './members/members.routes';

export const routes: Routes = [
    {
        path: 'teamMember',
        component: MembersComponent,
        children: membersRoutes
    }
];