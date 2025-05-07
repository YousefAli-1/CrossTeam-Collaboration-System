import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { MembersService } from '../../members.service';
import { Task } from '../../../app.model';
import { map, Observable,pipe } from 'rxjs';
@Component({
  selector: 'app-members-submission-table',
  standalone: true,
  imports: [],
  templateUrl: './members-submission-table.component.html',
  styleUrl: './members-submission-table.component.scss',
})
export class MembersSubmissionTableComponent implements OnInit {
  private membersService = inject(MembersService);
  private allSubmissionTasks = signal<Task[]>([]);

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
  ngOnInit(): void {
    const user = this.membersService.loggedInUser();
    if (user) {
      this.membersService.fetchTasksForSub(user.userID).subscribe({
        next: (tasks) => {
          this.allSubmissionTasks.set(tasks); 
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to fetch tasks:', error);
          this.isLoading.set(false);
        }
      });
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
    const user = this.membersService.loggedInUser();
    if (user) {
      this.membersService.fetchTasksForSub(user.userID).subscribe({
        next: (tasks) => {
          this.allSubmissionTasks.set(tasks); 
        },
        error: (error) => {
          console.error('Failed to fetch tasks:', error);
        }
      });
    }
  }
}
