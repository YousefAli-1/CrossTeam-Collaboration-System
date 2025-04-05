import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MembersService } from './members.service';
@Component({
  selector: 'app-members',
  imports: [RouterOutlet, MatSidenavModule, MatButtonModule, MatDividerModule, MatMenuModule, RouterLink, RouterLinkActive],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent  {
  private membersService = inject(MembersService);
  isOpened: boolean = false;
  projects = this.membersService.getProjectsByUserId(this.membersService.loggedInUser()?.userID || -1);


  toggleDrawer(): void {
  this.isOpened = !this.isOpened;
  }

  acceptInvitation(invitationId: number): void {
   return;
  }

  declineInvitation(invitationId: number): void {
    return;
  }
}