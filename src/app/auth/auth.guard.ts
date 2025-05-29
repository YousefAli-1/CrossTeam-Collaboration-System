import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const currentUser = localStorage.getItem('currentUser');
  const path = route.url[0]?.path || '';
  
  if (!currentUser) {
    if (path === '') {
      return true;
    }else if(path === 'aboutus'){
        return true;
    }else if(path === 'login'){
        return true;
    }else if(path === 'signup'){
        return true;
    }else{
    return router.navigate(['/unauthorized']);
      }
    }
  const user = JSON.parse(currentUser as string);
  if (['', 'login', 'signup'].includes(path)) {
    return router.navigate(['/unauthorized']);
  }

  if (['unauthorized', '404'].includes(path)) {
    return true;
  }
  
  if (user.isProjectManager) {
    if (path === 'projectManager') {
      return true;
    }
  } else {
    if (path === 'teamMember') {
      return true;
    }
  }
  return router.navigate(['/unauthorized']);
}; 