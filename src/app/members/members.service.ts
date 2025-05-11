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
} from '../app.model';
import { TeamMemberHttpService } from './team-member-http.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private httpService = inject(TeamMemberHttpService);
  private readonly projectsSignal = signal<Project[]>([]);
  private tasksSignal = signal<Task[]>([]);
  private projectsInvitationsSignal = signal<Invitation[]>([]);
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

  getloggedInUserwithPermissions(projectId: number): UserInProject | null {
    if (this.loggedInUser() === null) {
      return null;
    }

    var userWithPermissions = null;
    this.httpService
      .getUserPermissions(projectId, this.loggedInUser()?.userID || 0)
      .subscribe((userPermissions) => {
        userWithPermissions = { ...this.loggedInUser(), userPermissions };
      });

    return userWithPermissions;
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

  getPendingApprovalRequest(task: Task): ApprovalRequest | undefined {
    return task.approvalWorkflow.find(
      (request) => request.status !== 'Accepted'
    );
  }

  isTaskApprovalWorkflowTotallyFinished(task: Task): boolean {
    return task.approvalWorkflow.at(-1)?.status === 'Accepted';
  }
  
  private deleteInvitationLocally(invitation: Invitation): void {
    this.projectsInvitationsSignal.set(this.projectsInvitations().filter((invitationElement)=>{
      return invitationElement.projectId!==invitation.projectId && invitationElement.memberId!==invitation.memberId
    }))
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

  acceptTask(taskId: number) {
    this.tasksSignal.set(
      this.tasksSignal().map((task) => {
        if (task.taskID !== taskId) {
          return task;
        }

        return this.updateApprovalRequestStatus(task, 'Accepted');
      })
    );
  }

  rejectTask(taskId: number) {
    this.tasksSignal.set(
      this.tasksSignal().map((task) => {
        if (task.taskID !== taskId) {
          return task;
        }

        return this.updateApprovalRequestStatus(task, 'Rejected');
      })
    );
  }

  submitTask(taskID: number): void {
    const user = this.loggedInUser();
    if (!user) return;

    const task = this.tasksSignal().find((t) => t.taskID === taskID);

    if (!task) {
      console.warn('Task not found');
      return;
    }
    const isAssigned = this.isUserAssignedInTask(user, task);
    if (!isAssigned) {
      console.warn('User is not assigned to this task');
      return;
    }
    task.isSubmitted = true;
    task.submittedBy = user as UserEssentials;
    task.updatedAt = new Date();

    console.log(`Task ${taskID} submitted by ${user.name}`);
  }
  logout(): void {
    this.loggedInUserWritableSignal.set(null);
  }
}
