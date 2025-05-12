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
 
   reviewTasks=computed<Task[]>(()=>{
    this.allReviewTasks()
    return this.applyFilter(this.filterProjectId())
  });
 
  isTaskReviewFinished(task: Task) : boolean{
    return this.membersService.getPendingApprovalRequest(task) === undefined
  }

  private applyFilter(filterProjectId: number) {
     if (filterProjectId!==0) {
       return this.allReviewTasks().filter(task =>
         task.projectID === filterProjectId
       );
     } else {
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
    return `${this.currentTeamReviewing(task)} Team ${(this.currentTaskStatus(task) === 'Pending') ? 'is currrently reviewing' : 'has'+this.currentTaskStatus(task)?.toLowerCase() } the task submission.`
  }

  acceptTask(task: Task){
    if(confirm("Are you sure you want to accept this Task? \nThis action is irreversable!")){
      this.membersService.acceptTask(task);
    };
  }

  rejectTask(task: Task){
    if(confirm("Are you sure you want to reject this Task? \nThis action is irreversable!")){
      this.membersService.rejectTask(task);
    };
  }
}
