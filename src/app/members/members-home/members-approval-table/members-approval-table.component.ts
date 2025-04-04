import { Component, inject } from '@angular/core';
import { MembersService } from '../../members.service';

@Component({
  selector: 'app-members-approval-table',
  standalone: true,
  imports: [],
  templateUrl: './members-approval-table.component.html',
  styleUrl: './members-approval-table.component.scss'
})
export class MembersApprovalTableComponent {
  reviewTasks=inject(MembersService).getReviewTasksForLoggedInUser();
}
