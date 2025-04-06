import { CanActivateFn, Router, Routes } from '@angular/router';
import { MembersComponent } from './members/members.component';
import { membersRoutes } from './members/members.routes';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UnauthorizedComponent } from './auth/unauthorized/unauthorized.component';
import { NotFoundComponent } from './auth/not-found/not-found.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { inject } from '@angular/core';
import { MembersService } from './members/members.service';
import { AboutusComponent } from './aboutus/aboutus.component';

export const membersAuthGuard: CanActivateFn = () => {
    const service = inject(MembersService);
    const router = inject(Router);

    if (service.isUserLoggedIn()) {
      return true;
    }
    
    return router.navigateByUrl('/unauthorized');
  };
export const routes: Routes = [
    {
        path: 'teamMember',
        component: MembersComponent,
        canActivate: [membersAuthGuard],
        children: membersRoutes
    },
    { 
        path: 'login', 
        component: LoginComponent 
    },
    { 
        path: 'signup', 
        component: SignupComponent 
    },{
        path:'aboutus',
        component:AboutusComponent
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