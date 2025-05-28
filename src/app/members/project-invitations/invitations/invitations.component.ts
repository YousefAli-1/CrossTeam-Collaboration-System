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
  private router=inject(Router)
  invitation = input<Invitation>();
  projectName: String = this.membersService.getProjectByProjectId(this.invitation()?.projectId || 0)?.projectName || "";
  acceptInvitation() {
    this.membersService.acceptInvitation(this.invitation() || {memberId: 0, projectId: 0, invitedBy: {userID: 0, name: '', email: ''}, status: 'Pending'});
    this.router.navigateByUrl('/teamMember/projects');
  }
  rejectInvitation() {
    this.membersService.rejectInvitation(this.invitation() || {memberId: 0, projectId: 0, invitedBy: {userID: 0, name: '', email: ''}, status: 'Pending'});
    this.router.navigateByUrl('/teamMember/homepage');
  }
}
