import { Component, computed, inject,input, signal,OnInit } from '@angular/core';
import { MembersService } from '../../members.service';
import { ApprovalRequestStatus, Task } from '../../../app.model';
@Component({
  selector: 'app-members-approval-table',
  standalone: true,
  imports: [],
  templateUrl: './members-approval-table.component.html',
  styleUrl: './members-approval-table.component.scss'
})
export class MembersApprovalTableComponent implements OnInit {
  private membersService=inject(MembersService);
   private allReviewTasks=signal(this.membersService.getReviewTasksForLoggedInUser());
   filterProjectId= input<number>(0);
   isLoading = signal(true);
   // Computed signal that applies the filter
   reviewTasks = computed(() => {
    const filter = this.filterProjectId();
    const tasks = this.allReviewTasks();
    return filter
    ? tasks.filter((task) => task.projectID === filter)
    : tasks;
  });
  ngOnInit(): void {
    const user = this.membersService.loggedInUser();
    if (user) {
      this.membersService.fetchTasksForRev(user.userID).subscribe({
        next: (tasks) => {
          this.allReviewTasks.set(tasks); 
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to fetch tasks:', error);
          this.isLoading.set(false);
        }
      });
    }
  }

   DoesNeedAction(task: Task): boolean{
    return this.membersService.getPendingApprovalRequest(task)?.status==='Pending';
  }

  currentTaskStatus(task: Task): ApprovalRequestStatus | undefined{
    return this.membersService.getPendingApprovalRequest(task)?.status;
  }

  currentTeamReviewing(task: Task): String | undefined{
    return this.membersService.getPendingApprovalRequest(task)?.assigned.teamName;
  }

  acceptTask(taskId: number){
    if(confirm("Are you sure you want to accept this Task? \nThis action is irreversable!")){
      this.membersService.acceptTask(taskId);
      this.allReviewTasks.set(this.membersService.getReviewTasksForLoggedInUser());
    };
  }

  rejectTask(taskId: number){
    if(confirm("Are you sure you want to reject this Task? \nThis action is irreversable!")){
      this.membersService.rejectTask(taskId);
      this.allReviewTasks.set(this.membersService.getReviewTasksForLoggedInUser());
    };
  }
  downloadSub(taskID:number){
   this.membersService.downloadSubmission(taskID);
  }
}
