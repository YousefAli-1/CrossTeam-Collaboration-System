import { Component, inject, OnInit, OnDestroy, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet,Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MembersService } from './members.service';
import { type Project } from '../app.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-members',
  imports: [RouterOutlet, MatSidenavModule, MatButtonModule, MatDividerModule, MatMenuModule, RouterLink, RouterLinkActive],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent {
  private membersService = inject(MembersService);
  isOpened: boolean = false;
  userProjects= computed<Project[]>(()=>this.membersService.projects());
  
  private router=inject(Router);
  logout() {
    this.membersService.logout(); 
    this.router.navigate(['/']); 
  }
  toggleDrawer(): void {
    this.isOpened = !this.isOpened;
  }
}