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
    return inject(MembersService).getProjectByProjectId(Number.parseInt(route.paramMap.get('projectID')!)) || new RedirectCommand(inject(Router).parseUrl('/404'));
};
  export const projectsAuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const service = inject(MembersService);
    const router = inject(Router);
  
    const user = service.loggedInUser();
    const projectIdFromUrl = Number(route.params['projectID']); 

    if (!user || isNaN(projectIdFromUrl)) {
      return router.navigateByUrl('/unauthorized');
    }
  
  
  
    if (!user) {
      return router.navigateByUrl('/unauthorized');
    }
  
    const userProjects = service.getProjectsByUserId(user.userID);
    const hasAccess = userProjects.some(project => project.projectID === projectIdFromUrl);
    if (hasAccess) {
      return true;
    }
  
    return router.navigateByUrl('/unauthorized');
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
                path: ':projectID',
                component: ProjectDetailsComponent,
                resolve: {Project: ProjectResolver},
                canActivate: [projectsAuthGuard]
            },
        ]
    }
];