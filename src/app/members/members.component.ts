import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MembersService } from './members.service';
import { type Project } from '../app.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-members',
  imports: [RouterOutlet, MatSidenavModule, MatButtonModule, MatMenuModule, RouterLink, RouterLinkActive],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit, OnDestroy {
  private membersService = inject(MembersService);
  isOpened: boolean = false;
  userProjects: Project[] = [];
  private subscription: Subscription | null = null;
  
  ngOnInit(): void {
    this.loadProjects();
    
    this.subscription = this.membersService.projectsChanged.subscribe(() => {
      this.loadProjects();
    });
  }
  
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  private loadProjects(): void {
    this.userProjects = this.membersService.getProjectsByUserId(
      this.membersService.loggedInUser()?.userID || -1
    );
  }

  toggleDrawer(): void {
    this.isOpened = !this.isOpened;
  }
}