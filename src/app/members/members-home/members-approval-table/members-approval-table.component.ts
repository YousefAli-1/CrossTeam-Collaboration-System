import { Component, inject,Input } from '@angular/core';
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
   private allReviewTasks: Task[] = this.membersService.getReviewTasksForLoggedInUser();
 
   private _filterProjectName: String = '';
 
   @Input() 
   set filterProjectName(value: String) {
     this._filterProjectName = value;
     this.applyFilter();
   }
   get filterProjectName(): String {
     return this._filterProjectName;
   }
 
   reviewTasks: Task[] = this.allReviewTasks;
 
 
   private applyFilter(): void {
     if (this.filterProjectName) {
       this.reviewTasks = this.allReviewTasks.filter(task =>
         task.project.projectName === this.filterProjectName
       );
     } else {
       this.reviewTasks = this.allReviewTasks;
     }
   }

   DoesNeedAction(task: Task): boolean{
    return this.membersService.getPendingApprovalRequest(task)?.status==='Pending';
  }

  currentTaskStatus(task: Task): ApprovalRequestStatus | undefined{
    return this.membersService.getPendingApprovalRequest(task)?.status;
  }

  acceptTask(taskId: number){
    if(confirm("Are you sure you want to accept this Task? \nThis action is irreversable!")){
      this.membersService.acceptTask(taskId);
    };
  }

  rejectTask(taskId: number){
    if(confirm("Are you sure you want to reject this Task? \nThis action is irreversable!")){
      this.membersService.rejectTask(taskId);
    };
  }
}
