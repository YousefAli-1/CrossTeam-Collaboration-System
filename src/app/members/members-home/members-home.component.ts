import { Component, inject, computed } from '@angular/core';
import { MembersService } from '../members.service'; 
import { type User } from '../../app.model' 
import { MembersSubmissionTableComponent } from './members-submission-table/members-submission-table.component';
import { MembersApprovalTableComponent } from './members-approval-table/members-approval-table.component';
@Component({
    selector: 'app-members-home',
    standalone: true,
    imports: [MembersSubmissionTableComponent,MembersApprovalTableComponent],
    templateUrl: './members-home.component.html', 
    styleUrls: ['./members-home.component.scss']
})
export class MembersHomeComponent {
  private membersService = inject(MembersService);
  currentUser = computed<User | null>(()=>this.membersService.loggedInUser()); 
}
