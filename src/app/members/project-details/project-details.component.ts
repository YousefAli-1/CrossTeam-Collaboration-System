import { Component, inject, computed,signal, OnInit, DestroyRef, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { type User, type Project, UserInProject } from '../../app.model'
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

  activeTab: 'submission' | 'approval' | undefined;

  currentProjectId= signal<number>(-1);
  project = computed<Project | null>(()=>this.membersService.getProjectByProjectId(this.currentProjectId()));
  currentUser!:Signal<UserInProject | null>;


  ngOnInit(): void {
      const subscribtion=this.route.url.subscribe({next: (currentRoute)=>{
        this.currentProjectId.set(Number(currentRoute[0]) || -1);
        this.currentUser = computed<UserInProject | null>(()=>this.membersService.getloggedInUserwithPermissions(this.currentProjectId()));
      }});
      this.destroyRef.onDestroy(()=>{
        subscribtion.unsubscribe();
      });

    if(this.hasSubmissionAuthority()){
      this.activeTab='submission';
    }
    else if (this.hasApprovalAuthority()){
      this.activeTab='approval'
    }
  }
  
  hasSubmissionAuthority() : boolean{
    return this.currentUser()?.canSubmitTask || false;
  }

  hasApprovalAuthority() : boolean{
    return this.currentUser()?.canAcceptOrRejectTask || false;
  }
}