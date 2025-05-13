import { Component,inject,signal } from '@angular/core';
import { MembersService } from '../members.service';
import { type Invitation } from '../../app.model';
import { InvitationsComponent } from './invitations/invitations.component';
@Component({
  selector: 'app-project-invitations',
  imports: [InvitationsComponent],
  templateUrl: './project-invitations.component.html',
  styleUrl: './project-invitations.component.scss'
})
export class ProjectInvitationsComponent {
  private membersService = inject(MembersService);

  userInvitations = this.membersService.projectsInvitations;
}

