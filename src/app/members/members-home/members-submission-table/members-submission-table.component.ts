import { Component, computed, inject, input } from '@angular/core';
import { MembersService } from '../../members.service';
import { Task } from '../../../app.model';
@Component({
  selector: 'app-members-submission-table',
  standalone: true,
  imports: [],
  templateUrl: './members-submission-table.component.html',
  styleUrl: './members-submission-table.component.scss',
})
export class MembersSubmissionTableComponent {
  private membersService = inject(MembersService);
  private allSubmissionTasks = this.membersService.submissionTasks;

  filterProjectId = input<number>(0);

  submissionTasks = computed<Task[]>(() => {
    this.allSubmissionTasks();
    return this.applyFilter(this.filterProjectId());
  });

  private applyFilter(filterProjectId: number) {
    if (filterProjectId !== 0) {
      return this.allSubmissionTasks().filter(
        (task) => task.projectID === filterProjectId
      );
    } else {
      return this.allSubmissionTasks();
    }
  }
  submitTask(taskID: any) {
    this.membersService.submitTask(taskID);
  }
}
