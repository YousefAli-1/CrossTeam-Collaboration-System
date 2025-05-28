import { Component ,inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProjectManagerService } from './project-manager.service';



@Component({
  selector: 'app-project-manager',
  imports: [RouterOutlet, MatSidenavModule, MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './project-manager.component.html',
  styleUrl: './project-manager.component.scss'
})

export class ProjectManagerComponent {
  private membersService=inject(ProjectManagerService);
  isOpened: boolean = false;
  projects=this.membersService.getProjectsByUserId(this.membersService.loggedInUser()?.userID || -1);
  toggleDrawer(): void {
    this.isOpened = !this.isOpened;
}
}
