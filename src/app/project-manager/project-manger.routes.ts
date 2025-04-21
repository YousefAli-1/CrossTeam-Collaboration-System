import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Router, RouterStateSnapshot, Routes } from "@angular/router";

import { inject } from "@angular/core";
import { Project } from "../app.model";
import { ProjectManagerHomeComponent } from "./project-manager-home/project-manager-home.component";
import { ProjectManagerService } from "./project-manager.service";
import { ProjectManagerTasksComponent } from "./project-manager-tasks/project-manager-tasks.component";
import { ProjectManagerTeamsComponent } from "./project-manager-teams/project-manager-teams.component";
import { ProjectManagerProjectsComponent } from "./project-manager-projects/project-manager-projects.component";
  

type ResolveFn<T> = (  route: ActivatedRouteSnapshot,  state: RouterStateSnapshot) => MaybeAsync<T | RedirectCommand>
// const ProjectResolver: ResolveFn<{name: String, description: String}>=(route)=>{
//     console.log(route.paramMap.get('projectId'));
//     return inject(ProjectManagerService).getProjectsByUserId;
// };
export const ProjectManagerRoutes: Routes=[
    {
        pathMatch:'full',
        path: '',
        redirectTo: 'homepage'
    },
    {
        path: 'homepage',
        component: ProjectManagerHomeComponent
    },
     {
            path:'projects',
            component:ProjectManagerProjectsComponent
    },
    {
        path:'tasks',
        component: ProjectManagerTasksComponent
    },
    {
        path:'teams',
        component:ProjectManagerTeamsComponent
    }


];