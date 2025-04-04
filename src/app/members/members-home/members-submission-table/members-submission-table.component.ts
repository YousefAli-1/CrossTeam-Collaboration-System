import { Component, inject } from '@angular/core';
import { MembersService } from '../../members.service';

@Component({
  selector: 'app-members-submission-table',
  standalone: true,
  imports: [],
  templateUrl: './members-submission-table.component.html',
  styleUrl: './members-submission-table.component.scss'
})
export class MembersSubmissionTableComponent {
  submissionTasks=inject(MembersService).getSubmissionTasksForLoggedInUser();
}
