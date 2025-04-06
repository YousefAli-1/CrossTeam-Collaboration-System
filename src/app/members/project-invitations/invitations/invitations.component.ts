import { Component,input,inject } from '@angular/core';
import { type Invitation } from '../../../app.model';
import { MembersService } from '../../members.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [],
  templateUrl: './invitations.component.html',
  styleUrl: './invitations.component.scss'
})
export class InvitationsComponent {
  private membersService = inject(MembersService);
  invitation = input.required<Invitation>();
  private router=inject(Router)
  acceptInvitation() {
    this.membersService.updateInvitationStatus(this.invitation().invitationID, 'Accepted');
    this.invitation().status='Accepted';
    this.router.navigateByUrl('/teamMember/projects');
  }
  rejectInvitation() {
    this.membersService.updateInvitationStatus(this.invitation().invitationID, 'Rejected');
    this.invitation().status='Rejected';
    this.router.navigateByUrl('/teamMember/homepage');
  }
}
