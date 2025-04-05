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
    return inject(MembersService).getProjectByProjectId(Number.parseInt(route.paramMap.get('projectId')!)) || new RedirectCommand(inject(Router).parseUrl('/error404'));
};
export const membersAuthGuard: CanActivateFn = () => {
    const service = inject(MembersService);
    const router = inject(Router);
  
    const role = service.checkUserRole();
  
    if (role === 'TeamMember' ) {
      return true;
    }
    return router.navigateByUrl('/unauthorized');
  };
export const membersRoutes: Routes=[
    {
        pathMatch:'full',
        path: '',
        redirectTo: 'homepage',
        canMatch: [membersAuthGuard]
    },
    {
        path: 'homepage',
        component: MembersHomeComponent,
        canMatch: [membersAuthGuard]
    },
    {
        path: 'invitations',
        component: ProjectInvitationsComponent,
        canMatch: [membersAuthGuard]
    },
    {
        path:'projects',
        children: [{
                path: '',
                component:ProjectsComponent,
                canMatch: [membersAuthGuard]
            },
            {
                path: ':projectId',
                component: ProjectDetailsComponent,
                resolve: {Project: ProjectResolver},
                canMatch: [membersAuthGuard]
            },
        ]
    }
];