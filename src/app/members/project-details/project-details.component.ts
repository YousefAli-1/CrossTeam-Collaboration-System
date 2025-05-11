import {
  Component,
  inject,
  computed,
  signal,
  OnInit,
  DestroyRef,
  Signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { type User, type Project, UserInProject } from '../../app.model';
import { MembersSubmissionTableComponent } from '../members-home/members-submission-table/members-submission-table.component';
import { MembersApprovalTableComponent } from '../members-home/members-approval-table/members-approval-table.component';
import { MembersService } from '../members.service';
@Component({
  selector: 'app-project-details',
  imports: [MembersSubmissionTableComponent, MembersApprovalTableComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private membersService = inject(MembersService);
  private destroyRef = inject(DestroyRef);

  activeTab: 'submission' | 'approval' | undefined;

  currentProjectId = signal<number>(-1);
  project = computed<Project | null>(() =>
    this.membersService.getProjectByProjectId(this.currentProjectId())
  );
  currentUser = signal<UserInProject>({
    userID: 0,
    name: '',
    email: '',
    canAcceptOrRejectTask: false,
    canSubmitTask: false,
  });

  ngOnInit(): void {
    const subscribtion = this.route.url.subscribe({
      next: (currentRoute) => {
        this.currentProjectId.set(Number(currentRoute[0]) || -1);

        this.membersService
          .getloggedInUserPermissions(this.project()?.projectID || 0)
          .subscribe((userPermissions) => {
            this.currentUser.set({
              ...userPermissions,
              userID: this.membersService.loggedInUser()?.userID || 0,
              name: this.membersService.loggedInUser()?.name || '',
              email: this.membersService.loggedInUser()?.email || ''
            });

            if (this.hasSubmissionAuthority()) {
              this.activeTab = 'submission';
            } else if (this.hasApprovalAuthority()) {
              this.activeTab = 'approval';
            }
          });
      },
    });
    this.destroyRef.onDestroy(() => {
      subscribtion.unsubscribe();
    });
  }

  hasSubmissionAuthority(): boolean {
    return this.currentUser().canSubmitTask || false;
  }

  hasApprovalAuthority(): boolean {
    return this.currentUser().canAcceptOrRejectTask || false;
  }
}
