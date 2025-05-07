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
   private allReviewTasks=signal(this.membersService.getReviewTasksForLoggedInUser());
   filterProjectId= input<number>(0);
 
   reviewTasks=computed<Task[]>(()=>{
    this.allReviewTasks()
    return this.applyFilter(this.filterProjectId())
  });
 
 
   private applyFilter(filterProjectId: number) {
     if (filterProjectId!==0) {
       return this.allReviewTasks().filter(task =>
         task.project.projectID === filterProjectId
       );
     } else {
       return this.allReviewTasks();
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
}
