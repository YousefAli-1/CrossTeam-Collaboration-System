import { Component, computed, inject, input, signal } from '@angular/core';
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
  private allSubmissionTasks = signal(
    this.membersService.getSubmissionTasksForLoggedInUser()
  );

  filterProjectName = input<String>('');

  submissionTasks = computed<Task[]>(() => {
    this.allSubmissionTasks();
    return this.applyFilter(this.filterProjectName());
  });

  private applyFilter(filterProjectName: String) {
    if (filterProjectName !== '') {
      return this.allSubmissionTasks().filter(
        (task) => task.project.projectName === filterProjectName
      );
    } else {
      return this.allSubmissionTasks();
    }
  }
  submitTask(taskID: any) {
    this.membersService.submitTask(taskID);
    this.allSubmissionTasks.set(
      this.membersService.getSubmissionTasksForLoggedInUser()
    );
  }
}
