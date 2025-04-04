import { Injectable, signal } from '@angular/core';
import { dummyTeamMembers, dummyProjects, dummyTasks } from './dummy-members';
import {
  type TeamMember,
  type User,
  type Project,
  type Task,
  ApprovalRequest,
} from '../app.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly teamMembers = dummyTeamMembers;
  private readonly projects = dummyProjects;
  private readonly tasks = dummyTasks;

  private loggedInUserWritableSignal = signal<User | null>(this.teamMembers[1]);
  loggedInUser = this.loggedInUserWritableSignal.asReadonly();

  getProjectByProjectId(id: number) {
    return this.projects.find((project) => project.projectID === id);
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
      (member) => member.userID === user?.userID
    );
  }

  getSubmissionTasksForLoggedInUser(): Task[] {
    return this.tasks.filter((task) =>
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
    return this.tasks.filter(
      (task) =>
        task.approvalWorkflow.filter((request) =>
          this.isUserAssignedReviewerInApprovalWorkflow(user, request)
        ).length > 0
    );
  }

  private filterTasksWaitingForReviewerDecision(userTasks: Task[], reviewer: User | null): Task[] {
    return userTasks.filter((task) => {
      let subWorkflow = task.approvalWorkflow.slice(
        0,
        task.approvalWorkflow.findIndex((request) =>
          request.assigned.teamMembers.some(
            (teamMember) => teamMember.userID === reviewer?.userID
          )
        )
      );
      return subWorkflow.every((request) => request.status === 'Accepted');
    });
  }
  getReviewTasksForLoggedInUser(): Task[] {
    const userTasks: Task[] = this.getAllReviewerTasks(this.loggedInUser());

    return this.filterTasksWaitingForReviewerDecision(userTasks, this.loggedInUser());
  }
}
