import { Routes } from '@angular/router';
import { MembersComponent } from './members/members.component';
import { membersRoutes } from './members/members.routes';
import { ProjectManagerRoutes } from './project-manager/project-manger.routes';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';
import { NotFoundComponent } from './auth/not-found/not-found.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    // Protected routes
    {
        path: 'teamMember',
        component: MembersComponent,
        canActivate: [authGuard],
        children: membersRoutes
    },
    {
        path: 'projectManager',
        component: ProjectManagerComponent,
        canActivate: [authGuard],
        children: ProjectManagerRoutes
    },
    { 
        path: 'login', 
        component: LoginComponent,
        canActivate: [authGuard]
    },
    { 
        path: 'signup', 
        component: SignupComponent,
        canActivate: [authGuard]
    },
    {
        path: 'aboutus',
        component: AboutusComponent,
        canActivate: [authGuard]
    },
    { 
        path: 'unauthorized', 
        component: UnauthorizedComponent 
    },
    { 
        path: '404', 
        component: NotFoundComponent
    },
    { 
        path: '',  
        component: LandingPageComponent,
        canActivate: [authGuard]
    },
    { 
        path: '**',
        redirectTo: '/404' 
    }
];