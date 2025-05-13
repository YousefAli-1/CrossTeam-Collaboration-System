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

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {

  private httpService = inject(TeamMemberHttpService);
  private readonly projectsSignal = signal<Project[]>([]);
  private tasksSignal = signal<Task[]>([]);
  private projectsInvitationsSignal = signal<Invitation[]>([]);
  private readonly teamMembers = dummyTeamMembers;
  private readonly projects = dummyProjects;
  private tasks = signal<Task[]>(dummyTasks);

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
  constructor(private http: HttpClient) {

  }

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
      (teamMember) =>
        teamMember.userID === user?.userID && teamMember.canAcceptOrRejectTask
    );
  }

  private getAllReviewerTasks(user: User | null): Task[] {
    return this.tasks().filter(
      (task) =>
        task.approvalWorkflow.filter((request) =>
          this.isUserAssignedReviewerInApprovalWorkflow(user, request)
        ).length > 0 && task.isSubmitted && this.hasAcceptedInvite(user, this.projects.find((project) => project.projectID === task.project.projectID))
    );
  }

  private getAllDependenciesBeforeLoggedInReviewerOfTask(task: Task) {
    return task.approvalWorkflow.slice(
      0,
      task.approvalWorkflow.findIndex((request) =>
        request.assigned.teamMembers.some(
          (teamMember) => teamMember.userID === this.loggedInUser()?.userID
        )
      )
    );
  }

  private hasAcceptedInvite(user: User | null, project: Project | undefined) {
    return project?.members.find((member) => member.userID === user?.userID)?.isInviteAccepted || false;
  }

  private isDependenciesDone(task: Task) {
    return this.getAllDependenciesBeforeLoggedInReviewerOfTask(task).every(
      (request) => request.status === 'Accepted'
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
  
    return this.teamHttp.submitTask(taskID, user.userID, file).pipe(
      tap(() => {
        const task = this.tasks().find((t) => t.taskId === taskID);
        if (task) {
          task.isSubmitted = true;
          task.submittedBy = user as TeamMember;
          task.updatedAt = new Date();
          this.projectsChanged.next();
        }
      })
    );
  }
  
  fetchTasksForUser(userID: number) {
    this.teamHttp.getAllTasks(userID).subscribe({
      next: (tasks) => this.tasksSignal.set(tasks),
      error: (err) => console.error('Failed to fetch tasks:', err),
    });
  }

  fetchTasksForSub(userID: number) : Observable<Task[]>{
    return this.teamHttp.getUserTasksForSubmission(userID);
  }
  fetchTasksForRev(userID: number) : Observable<Task[]>{
    const user=this.loggedInUser;
    
    return this.teamHttp.getUserTasksForReview(userID);
  }
  getTasksSignal() {
    return this.tasksSignal;
  }

  logout(): void {
    this.loggedInUserWritableSignal.set(null);
  }
  downloadSubmission(taskID: number): void {
    const userId = this.loggedInUser()?.userID || 0;
  
    // First fetch tasks asynchronously
    this.fetchTasksForRev(userId).subscribe(tasks => {
      const task = tasks.find(t => t.taskId === taskID);
  
      if (!task) {
        console.error('Task not found');
        return;
      }
  
      console.log('Task:', task);
      console.log('File path:', task.filePath);
  
      this.teamHttp.downloadSubmission(taskID).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
  
          // Optional: Extract filename from filePath if needed
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
    });
  }
  
}
