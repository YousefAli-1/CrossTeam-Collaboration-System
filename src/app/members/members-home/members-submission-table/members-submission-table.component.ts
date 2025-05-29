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
  private allSubmissionTasks = this.membersService.submissionTasks;
  filterProjectId = input<number>(0);
  isLoading = signal(false);
  
  // Computed signal that applies the filter
  submissionTasks = computed(() => this.applyFilter(this.filterProjectId()));
  private applyFilter(filterProjectId: number) {
    if (filterProjectId !== 0) {
      return this.allSubmissionTasks().filter(
        (task) => task.projectID === filterProjectId
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
  
  submitTask(taskID: number): void {
    const file = this.selectedFiles[taskID];
    if (!file) {
      console.warn('No file selected for task:', taskID);
      return;
    }
    
    this.isLoading.set(true);
    
    // To ensure the task immediately disappears without flickering,
    // we'll remove it from the local UI before the request finishes
    const tasksSignal = this.membersService.getTasksSignal();
    const updatedTasks = tasksSignal().map(task => {
      if (task.taskID === taskID) {
        // Create a new task object with isSubmitted set to true
        return { ...task, isSubmitted: true };
      }
      return task;
    });
    
    // Update the signal immediately to remove task from UI
    tasksSignal.set(updatedTasks);
    
    this.membersService.submitTask(taskID, file).subscribe({
      next: () => {
        // Clear the selected file after successful submission
        delete this.selectedFiles[taskID];
        this.isLoading.set(false);
        this.membersService.trigger("Task submitted successfully!");
      },
      error: (error) => {
        this.isLoading.set(false);
        // Find the task by ID to check its deadline
        const task = tasksSignal().find(t => t.taskID === taskID);
        if (task && task.deadline instanceof Date && task.deadline.getTime() < Date.now()) {
          this.membersService.triggerError("Task is Overdue!");
        }
        // Revert the task back to unsubmitted state in case of error
        const revertedTasks = tasksSignal().map(task => {
          if (task.taskID === taskID) {
            return { ...task, isSubmitted: false };
          }
          return task;
        });
        tasksSignal.set(revertedTasks);
      }
    });
  }
}