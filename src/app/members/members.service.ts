import { computed, inject, Injectable, signal } from '@angular/core';

import {
  type User,
  type Project,
  type Task,
  type ApprovalRequest,
  type Invitation,
  type InvitationStatus,
  ApprovalRequestStatus,
  UserEssentials,
  UserInProject,
  UserPermissions,
} from '../app.model';
import { TeamMemberHttpService } from './team-member-http.service';
import { ToastService } from '../shared/toast/toast.service';

import { Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {

  private httpService = inject(TeamMemberHttpService);
  private toastService = inject(ToastService);
  private readonly projectsSignal = signal<Project[]>([]);
  private tasksSignal = signal<Task[]>([]);
  private projectsInvitationsSignal = signal<Invitation[]>([]);
  private tasks = signal<Task[]>([]);

  private loggedInUserWritableSignal = signal<User | null>(null);
  ReviewTasks = computed<Task[]>(() => {
    return this.tasksSignal().filter(
      (task) =>
        task.approvalWorkflow.filter((request) =>
          this.isUserAssignedReviewerInApprovalWorkflow(
            this.loggedInUser(),
            request
          )
        ).length > 0 && task.isSubmitted
    );
  });
  submissionTasks = computed<Task[]>(() => {
    return this.tasksSignal().filter(
      (task) =>
        this.isUserAssignedInTask(this.loggedInUser(), task) &&
        !task.isSubmitted
    );
  });
  projectsInvitations = this.projectsInvitationsSignal.asReadonly();
  projects = this.projectsSignal.asReadonly();
  loggedInUser = this.loggedInUserWritableSignal.asReadonly();

  getProjectsInvitations(): void {
    this.httpService
      .getProjectsInvitations(this.loggedInUser()?.userID || 0)
      .subscribe((value) => {
        this.projectsInvitationsSignal.set(value);
      });
  }

  private getTasks() {
    var tasks: Task[] = [];

    this.projectsSignal().forEach((project) => {
      tasks = tasks.concat(project.tasks);
    });

    this.tasksSignal.set(tasks);
  }

  private getProjects() {
    this.httpService
      .getProjects(this.loggedInUser()?.userID || 0)
      .subscribe((responseProjects) => {
        this.projectsSignal.set(responseProjects);
        this.getTasks();
      });
  }

  logIn(user: User) {
    this.loggedInUserWritableSignal.set(user);

    this.getProjects();
    this.getProjectsInvitations();
  }

  getProjectByProjectId(id: number): Project | null {
    return (
      this.projectsSignal().find((project) => project.projectID === id) || null
    );
  }

  getloggedInUserPermissions(projectId: number): Observable<UserPermissions> {
    return this.httpService.getUserPermissions(
      projectId,
      this.loggedInUser()?.userID || 0
    );
  }

  private isUserAssignedInTask(user: User | null, task: Task): boolean {
    return task.assigned.teamMembers.some(
      (member) => member.userID === user?.userID
    );
  }

  isUserLoggedIn(): boolean {
    if (this.loggedInUser()) {
      return true;
    } else {
      return false;
    }
  }
  private isUserAssignedReviewerInApprovalWorkflow(
    user: User | null,
    request: ApprovalRequest
  ): boolean {
    return request.assigned.teamMembers.some(
      (teamMember) => teamMember.userID === user?.userID
    );
  }


  getPendingApprovalRequest(task: Task): ApprovalRequest | undefined {
    return task.approvalWorkflow.find(
      (request) => request.status !== 'Accepted'
    );
  }

  private deleteInvitationLocally(invitation: Invitation): void {
    this.projectsInvitationsSignal.set(
      this.projectsInvitations().filter((invitationElement) => {
        return (
          invitationElement.projectId !== invitation.projectId &&
          invitationElement.memberId !== invitation.memberId
        );
      })
    );
  }

  rejectInvitation(invitation: Invitation): void {
    this.httpService
      .rejectProjectInvitation(invitation.projectId, invitation.memberId)
      .subscribe({
        complete: () => {
          this.deleteInvitationLocally(invitation);
        },
      });
  }

  acceptInvitation(invitation: Invitation): void {
    this.httpService
      .acceptProjectInvitation(invitation.projectId, invitation.memberId)
      .subscribe({
        complete: () => {
          this.deleteInvitationLocally(invitation);
          this.getProjects();
        },
      });
  }

  updateApprovalRequestStatus(task: Task, newStatus: ApprovalRequestStatus) {
    var approvalRequestId =
      this.getPendingApprovalRequest(task)?.approvalRequestID;
    return {
      ...task,
      approvalWorkflow: task.approvalWorkflow.map((request) => {
        if (request.approvalRequestID !== approvalRequestId) {
          return request;
        }

        return {
          ...request,
          status: newStatus,
          reviewedBy: this.loggedInUser(),
        };
      }),
    };
  }
  
  acceptTask(task: Task) {
    this.httpService
      .acceptApprovalRequest(
        this.getPendingApprovalRequest(task)?.approvalRequestID || 0,
        this.loggedInUser()?.userID || 0
      )
      .subscribe(() => {
        this.tasksSignal.set(
          this.tasksSignal().map((taskElement) => {
            if (taskElement.taskID !== task.taskID) {
              return taskElement;
            }

            return this.updateApprovalRequestStatus(task, 'Accepted');
          })
        );
      });
  }

  rejectTask(task: Task, comment: string | null) {
    this.httpService
      .rejectApprovalRequest(
        this.getPendingApprovalRequest(task)?.approvalRequestID || 0,
        this.loggedInUser()?.userID || 0,
        comment
      )
      .subscribe(() => {
        this.tasksSignal.set(
          this.tasksSignal().map((taskElement) => {
            if (taskElement.taskID !== task.taskID) {
              return taskElement;
            }
            return this.updateApprovalRequestStatus(task, 'Rejected');
          })
        );
      });
  }

  submitTask(taskID: number, file: File): Observable<any> {
    const user = this.loggedInUser();
    if (!user || !file) {
      return throwError(() => new Error('Missing file or user'));
    }
  
    return this.httpService.submitTask(taskID, user.userID, file).pipe(
      tap(() => {
        const task = this.tasks().find((t) => t.taskID === taskID);
        if (task) {
          task.isSubmitted = true;
          task.submittedBy = user;
          task.updatedAt = new Date();
          this.tasksSignal.set([...this.tasksSignal()]);
        }
      })
    );
  }

  getTasksSignal() {
    return this.tasksSignal;
  }

  logout(): void {
    this.loggedInUserWritableSignal.set(null);
  }
  downloadSubmission(taskID: number): void {
    // Get tasks directly from computed
    const tasks = this.ReviewTasks();
    const task = tasks.find((t) => t.taskID === taskID);
  
    if (!task) {
      console.error('Task not found:', taskID);
      return;
    }
  
    console.log('Task:', task);
    console.log('File path:', task.filePath);
  
    this.httpService.downloadSubmission(taskID).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
  
        const filename = task.fileName?.split('/').pop() || 'submission.zip';
        a.download = filename;
  
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download failed', err);
        alert('Failed to download file.');
      }
    });
  }

  triggerError(message: string) {
    this.toastService.error(message);
  }

  trigger(message: string) {
    this.toastService.success(message);
  }
}
