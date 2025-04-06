import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand,CanActivateFn, Router, RouterStateSnapshot, Routes } from "@angular/router";
import { MembersHomeComponent } from "./members-home/members-home.component";
import { ProjectsComponent } from "./projects/projects.component";
import { ProjectDetailsComponent } from "./project-details/project-details.component";
import { ProjectInvitationsComponent } from "./project-invitations/project-invitations.component";
import { inject } from "@angular/core";
import { MembersService } from "./members.service";
import { Project } from "../app.model";

  
 
type ResolveFn<T> = (  route: ActivatedRouteSnapshot,  state: RouterStateSnapshot) => MaybeAsync<T | RedirectCommand>
const ProjectResolver: ResolveFn<Project>=(route)=>{
    return inject(MembersService).getProjectByProjectId(Number.parseInt(route.paramMap.get('projectId')!)) || new RedirectCommand(inject(Router).parseUrl('/404'));
};

export const membersRoutes: Routes=[
    {
        pathMatch:'full',
        path: '',
        redirectTo: 'homepage'
    },
    {
        path: 'homepage',
        component: MembersHomeComponent,
    },
    {
        path: 'invitations',
        component: ProjectInvitationsComponent,
    },
    {
        path:'projects',
        children: [{
                path: '',
                component:ProjectsComponent,
            },
            {
                path: ':projectId',
                component: ProjectDetailsComponent,
                resolve: {Project: ProjectResolver},
            },
        ]
    }
];