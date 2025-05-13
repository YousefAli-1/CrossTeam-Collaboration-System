import { inject, Injectable, signal } from '@angular/core';
import { dummyTeamMembers, dummyProjects, dummyTasks } from './dummy-members';
import { Observable, Subject, tap, throwError } from 'rxjs';
import {
  type TeamMember,
  type User,
  type Project,
  type Task,
  type ApprovalRequest,
  type Invitation,
  ProjectMember,
  type InvitationStatus,
  ApprovalRequestStatus,
} from '../app.model';
import { TeamMemberHttpService } from './team-member-http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly teamMembers = dummyTeamMembers;
  private readonly projects = dummyProjects;
  private tasks = signal<Task[]>(dummyTasks);
  private tasksSignal = signal<Task[]>([]);
  private loggedInUserWritableSignal = signal<User | null>(null);
  projectsChanged = new Subject<void>()
  loggedInUser = this.loggedInUserWritableSignal.asReadonly();
  private teamHttp = inject(TeamMemberHttpService);
  constructor(private http: HttpClient) {

  }

  logIn(user: User) {
    this.loggedInUserWritableSignal.set(user);
  }

  getProjectByProjectId(id: number): Project | null {
    return this.projects.find((project) => project.projectID === id) || null;
  }

  getProjectsByUserId(userId: number): Project[] {
    return this.projects.filter((project) =>
      project.members.some(
        (member) => member.userID === userId && member.isInviteAccepted
      )
    );
  }

  getMembersByProjectId(id: number): TeamMember[] {
    return (
      this.projects.find((project) => project.projectID === id)?.members || []
    );
  }

  private isUserAssignedInTask(user: User | null, task: Task): boolean {
    return task.assigned.teamMembers.some(
      (member) => member.userID === user?.userID && member.canSubmitTask
    );
  }

  getSubmissionTasksForLoggedInUser(): Task[] {
    return this.tasks().filter(
      (task) =>
        this.isUserAssignedInTask(this.loggedInUser(), task) &&
        !task.isSubmitted
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

  private isDependingOnLoggedInUserTeam(task: Task) {
    return (
      this.getPendingApprovalRequest(task)?.assigned.teamMembers.findIndex(
        (member) => member.userID === this.loggedInUser()?.userID
      ) !== -1
    );
  }
  private isTaskWaitingForReview(task: Task) {
    return (
      this.isDependenciesDone(task) &&
      this.isDependingOnLoggedInUserTeam(task) &&
      !this.isTaskApprovalWorkflowTotallyFinished(task)
    );
  }

  private filterTasksWaitingForReviewerDecision(userTasks: Task[]): Task[] {
    return userTasks.filter((task) => {
      return this.isTaskWaitingForReview(task);
    });
  }

  getReviewTasksForLoggedInUser(): Task[] {
    const userTasks: Task[] = this.getAllReviewerTasks(this.loggedInUser());

    return this.filterTasksWaitingForReviewerDecision(userTasks);
  }

  getPendingApprovalRequest(task: Task): ApprovalRequest | undefined {
    return task.approvalWorkflow.find(
      (request) => request.status !== 'Accepted'
    );
  }

  isTaskApprovalWorkflowTotallyFinished(task: Task): boolean {
    return task.approvalWorkflow.at(-1)?.status === 'Accepted';
  }

  getInvitationsForUser(userID: number): Invitation[] {
    return this.projects
      .flatMap((project) => project.invitations || [])
      .filter(
        (invitation) =>
          invitation.member.userID === userID && invitation.status === 'Pending'
      );
  }

  updateInvitationStatus(invitationID: number, status: InvitationStatus): void {
    const invitation = this.projects
      .flatMap((project) => project.invitations || [])
      .find((invitation) => invitation.invitationID === invitationID);

    if (invitation) {
      invitation.status = status;
      if (status === 'Accepted') {
        const project = invitation.project;
        const invitedUser = invitation.member as ProjectMember;
        invitedUser.isInviteAccepted = true;
        project.members.push(invitedUser);

        if (invitedUser.Projects) {
          invitedUser.Projects.push(project);
        } else {
          invitedUser.Projects = [project];
        }

        this.projectsChanged.next();
      }
    }
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
          reviewedBy:
            task.project.members.find(
              (teamMember) => teamMember.userID === this.loggedInUser()?.userID
            ) || null,
        };
      }),
    };
  }

  acceptTask(taskId: number) {
    this.tasks.set(
      this.tasks().map((task) => {
        if (task.taskId !== taskId) {
          return task;
        }

        return this.updateApprovalRequestStatus(task, 'Accepted');
      })
    );
  }

  rejectTask(taskId: number) {
    this.tasks.set(
      this.tasks().map((task) => {
        if (task.taskId !== taskId) {
          return task;
        }

        return this.updateApprovalRequestStatus(task, 'Rejected');
      })
    );
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
