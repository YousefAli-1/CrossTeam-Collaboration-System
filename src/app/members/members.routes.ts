import { ActivatedRouteSnapshot, MaybeAsync, RouterStateSnapshot, Routes } from "@angular/router";
import { MembersHomeComponent } from "./members-home/members-home.component";
import { ProjectsComponent } from "./projects/projects.component";
import { ProjectDetailsComponent } from "./project-details/project-details.component";
import { inject } from "@angular/core";
import { MembersService } from "./members.service";

  

type ResolveFn<T> = (  route: ActivatedRouteSnapshot,  state: RouterStateSnapshot) => MaybeAsync<T>
const ProjectResolver: ResolveFn<{name: String, description: String}>=(route)=>{
    console.log(route.paramMap.get('projectId'));
    return inject(MembersService).getProjectById(Number.parseInt(route.paramMap.get('projectId')!));
};
export const membersRoutes: Routes=[
    {
        pathMatch:'full',
        path: '',
        redirectTo: 'homepage'
    },
    {
        path: 'homepage',
        component: MembersHomeComponent
    },
    {
        path:'projects',
        children: [{
                path: '',
                component:ProjectsComponent
            },
            {
                path: ':projectId',
                component: ProjectDetailsComponent,
                resolve: {Project: ProjectResolver}
            }
        ]
    }
];