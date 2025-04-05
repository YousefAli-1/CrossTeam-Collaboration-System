import { Injectable, signal } from '@angular/core';
import { dummyTeamMembers, dummyProjects, dummyTasks } from './dummy-members';
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

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly teamMembers = dummyTeamMembers;
  private readonly projects = dummyProjects;
  private tasks = signal<Task[]>(dummyTasks);

  private loggedInUserWritableSignal = signal<User | null>(this.teamMembers[1]);
  loggedInUser = this.loggedInUserWritableSignal.asReadonly();

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
    return this.tasks().filter((task) =>
      this.isUserAssignedInTask(this.loggedInUser(), task)
    );
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
        ).length > 0 && task.isSubmitted
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

  private isDependenciesDone(task: Task) {
    return this.getAllDependenciesBeforeLoggedInReviewerOfTask(task).every(
      (request) => request.status === 'Accepted'
    );
  }

  private isTaskWaitingForReview(task: Task) {
    return (
      this.isDependenciesDone(task) &&
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
      .filter((invitation) => invitation.member.userID === userID);
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
        if (task.taskID !== taskId) {
          return task;
        }

        return this.updateApprovalRequestStatus(task, 'Accepted');
      })
    );
  }

  rejectTask(taskId: number) {
    this.tasks.set(
      this.tasks().map((task) => {
        if (task.taskID !== taskId) {
          return task;
        }

        return this.updateApprovalRequestStatus(task, 'Rejected');
      })
    );
  }
}