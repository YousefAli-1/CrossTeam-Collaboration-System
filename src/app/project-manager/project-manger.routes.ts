import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Router, RouterStateSnapshot, Routes } from "@angular/router";

import { inject } from "@angular/core";
import { Project } from "../app.model";
import { ProjectManagerHomeComponent } from "./project-manager-home/project-manager-home.component";
  

type ResolveFn<T> = (  route: ActivatedRouteSnapshot,  state: RouterStateSnapshot) => MaybeAsync<T | RedirectCommand>

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

];