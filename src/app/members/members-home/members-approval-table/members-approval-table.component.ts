import { Component, computed, inject,input, signal } from '@angular/core';
import { MembersService } from '../../members.service';
import { ApprovalRequestStatus, Task } from '../../../app.model';
@Component({
  selector: 'app-members-approval-table',
  standalone: true,
  imports: [],
  templateUrl: './members-approval-table.component.html',
  styleUrl: './members-approval-table.component.scss'
})
export class MembersApprovalTableComponent {
  private membersService=inject(MembersService);
   private allReviewTasks=this.membersService.ReviewTasks;
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
 
  isTaskReviewFinished(task: Task) : boolean{
    return this.membersService.getPendingApprovalRequest(task) === undefined
  }

  private applyFilter(filterProjectId: number) {
     if (filterProjectId!==0) {
        this.isLoading.set(false);
       return this.allReviewTasks().filter(task =>
         task.projectID === filterProjectId
       );
     } else {
        this.isLoading.set(false);
       return this.allReviewTasks();
     }
   }


   private isLoggedInUserEnrolledInCurrentReviewTeam(task: Task): boolean{
    return this.membersService.getPendingApprovalRequest(task)?.assigned.teamMembers.find((member)=>member.userID===this.membersService.loggedInUser()?.userID) !== undefined
   }

   DoesNeedAction(task: Task): boolean{
    return this.currentTaskStatus(task) === 'Pending' && this.isLoggedInUserEnrolledInCurrentReviewTeam(task);
  }

  currentTaskStatus(task: Task): ApprovalRequestStatus | undefined{
    return this.membersService.getPendingApprovalRequest(task)?.status;
  }

  currentTeamReviewing(task: Task): String | undefined{
    return this.membersService.getPendingApprovalRequest(task)?.assigned.teamName;
  }

  getTaskInfoMessage(task: Task){
    return `${this.currentTeamReviewing(task)} Team ${(this.currentTaskStatus(task) === 'Pending') ? 'is currrently reviewing' : 'has rejected' } the task submission.`
  }

  acceptTask(task: Task){
    if(confirm("Are you sure you want to accept this Task? \nThis action is irreversable!")){
      this.membersService.acceptTask(task);
    };
  }

  rejectTask(task: Task){
    if(confirm("Are you sure you want to reject this Task? \nThis action is irreversable!")){
      let comment=window.prompt('Add your comment here (optional)');
      this.membersService.rejectTask(task,comment);
    };
  }
  downloadSub(taskID:number){
   this.membersService.downloadSubmission(taskID);
  }
}
