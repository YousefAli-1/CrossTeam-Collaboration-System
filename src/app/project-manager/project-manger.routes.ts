import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Router, RouterStateSnapshot, Routes } from "@angular/router";

import { inject } from "@angular/core";
import { Project } from "../app.model";
import { ProjectManagerHomeComponent } from "./project-manager-home/project-manager-home.component";
import { ProjectManagerService } from "./project-manager.service";
import { ProjectManagerTasksComponent } from "./project-manager-tasks/project-manager-tasks.component";
import { ProjectManagerTeamsComponent } from "./project-manager-teams/project-manager-teams.component";
import { ProjectManagerProjectsComponent } from "./project-manager-projects/project-manager-projects.component";
import { CreateTaskComponent } from "./project-manager-tasks/create-tasks/create-tasks.component";
import { EditTasksComponent } from "./project-manager-tasks/edit-tasks/edit-tasks.component";
import { CreateProjectComponent } from "./project-manager-projects/create-project/create-project.component";
import { EditProjectComponent } from "./project-manager-projects/edit-project/edit-project.component";
import { CreateTeamsComponent } from "./project-manager-teams/create-teams/create-teams.component";
  

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
    },
    {
        path:'createTasks',
        component:CreateTaskComponent
    },
    {
        path:'editTasks',
        component:EditTasksComponent
    },
    {
        path:'createProject',
        component:CreateProjectComponent
    },
    {
        path:'editProject',
        component:EditProjectComponent
    },
    {
        path:'createTeam',
        component:CreateTeamsComponent
    }


];