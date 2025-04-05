import { Component, inject, computed,signal, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { type User, type Project } from '../../app.model'
import { MembersSubmissionTableComponent } from '../members-home/members-submission-table/members-submission-table.component';
import { MembersApprovalTableComponent } from '../members-home/members-approval-table/members-approval-table.component';
import { MembersService } from '../members.service';
@Component({
  selector: 'app-project-details',
  imports: [MembersSubmissionTableComponent, MembersApprovalTableComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private membersService = inject(MembersService);
  private destroyRef=inject(DestroyRef);

  currentProjectId= signal<number>(-1);
  project = computed<Project | null>(()=>this.membersService.getProjectByProjectId(this.currentProjectId()));
  currentUser = signal<User | null>(this.membersService.loggedInUser()); 

  ngOnInit(): void {
      const subscribtion=this.route.url.subscribe({next: (currentRoute)=>{
        this.currentProjectId.set(Number(currentRoute[0]) || -1);
      }});
      this.destroyRef.onDestroy(()=>{
        subscribtion.unsubscribe();
      });
  }

  hasSubmissionAuthority() : boolean{
    return this.project()?.members.find((teamMember)=>teamMember.userID===this.currentUser()?.userID)?.canSubmitTask || false;
  }

  hasApprovalAuthority() : boolean{
    return this.project()?.members.find((teamMember)=>teamMember.userID===this.currentUser()?.userID)?.canAcceptOrRejectTask || false;
  }
}