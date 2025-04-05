import { Routes } from '@angular/router';
import { MembersComponent } from './members/members.component';
import { membersRoutes } from './members/members.routes';
<<<<<<< HEAD
=======
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';
import { NotFoundComponent } from './auth/not-found/not-found.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

>>>>>>> 5bc22007839d05b3c982191a7f21cc8383894635
export const routes: Routes = [
    {
        path: 'teamMember',
        component: MembersComponent,
        children: membersRoutes
    },
    { 
        path: 'login', 
        component: LoginComponent 
    },
    { 
        path: 'signup', 
        component: SignupComponent 
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
        component: LandingPageComponent
    },
    { 
        path: '**'
        , redirectTo: '/404' 
    }
];