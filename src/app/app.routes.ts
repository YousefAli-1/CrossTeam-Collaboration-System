import { Routes } from '@angular/router';
import { MembersComponent } from './members/members.component';
import { membersRoutes } from './members/members.routes';
import { ProjectManagerRoutes } from './project-manager/project-manger.routes';
import { ProjectCardComponent } from './members/projects/project-card/project-card.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
export const routes: Routes = [
    {
        path: 'teamMember',
        component: MembersComponent,
        children: membersRoutes
    },
    {
        path:'projectManager',
        component: ProjectManagerComponent,
        children:ProjectManagerRoutes
    }
];