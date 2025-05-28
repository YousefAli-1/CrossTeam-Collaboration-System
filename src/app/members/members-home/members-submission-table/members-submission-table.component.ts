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
export class MembersSubmissionTableComponent implements OnInit {
  private membersService = inject(MembersService);
  private allSubmissionTasks = this.membersService.submissionTasks;

  filterProjectId = input<number>(0);
  isLoading = signal(true);
  // Computed signal that applies the filter
  submissionTasks = computed(() => {
    const filter = this.filterProjectId();
    const tasks = this.allSubmissionTasks();
    return filter
    ? tasks.filter((task) => task.projectID === filter)
    : tasks;
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

  this.membersService.submitTask(taskID, file).subscribe({
    next: () => {
      // Refresh task list only after successful submission
      const user = this.membersService.loggedInUser();
      if (user) {
        this.membersService.fetchTasksForSub(user.userID).subscribe({
          next: (tasks) => {
            this.allSubmissionTasks.set(tasks);
            delete this.selectedFiles[taskID]; // Clear file input (optional)
          },
          error: (error) => {
            console.error('Failed to refresh tasks:', error);
          }
        });
      }
    },
    error: (error) => {
      console.error('Failed to submit task:', error);
    }
  });
}

}
