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
  selectedFiles: { [taskId: number]: File } = {};

onFileSelected(event: Event, taskId: number): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFiles[taskId] = input.files[0];
  }
}
  submitTask(taskID: any) {
    const file = this.selectedFiles[taskID];
    this.membersService.submitTask(taskID,file);
    this.allSubmissionTasks.set(
      this.membersService.getSubmissionTasksForLoggedInUser()
    );
  }
}
