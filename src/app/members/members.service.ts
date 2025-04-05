import { Injectable, signal } from '@angular/core';
import { dummyTeamMembers, dummyProjects, dummyTasks } from './dummy-members';
import { Subject } from 'rxjs';
import {
  type TeamMember,
  type User,
  type Project,
  type Task,
  type ApprovalRequest,
  type Invitation,
  ProjectMember,
  type InvitationStatus
} from '../app.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private readonly teamMembers = dummyTeamMembers;
  private readonly projects = dummyProjects;
  private readonly tasks = dummyTasks;
  projectsChanged = new Subject<void>()
  private loggedInUserWritableSignal = signal<User | null>(this.teamMembers[0]);
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
      (member) => member.userID === user?.userID
    );
  }

  getSubmissionTasksForLoggedInUser(): Task[] {
    return this.tasks.filter((task) =>
      this.isUserAssignedInTask(this.loggedInUser(), task)&&
    !task.isSubmitted
    );
  }
  checkUserRole(): 'ProjectManager' | 'TeamMember' | 'User' {
    const user = this.loggedInUser();

    if (!user) return 'User';

    const isTeamMember = 'canSubmitTask' in user;
    if (isTeamMember) return 'TeamMember';

    return 'User';
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
        ).length > 0 && task.isSubmitted
    );
  }

  private filterTasksWaitingForReviewerDecision(
    userTasks: Task[],
    reviewer: User | null
  ): Task[] {
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

    return this.filterTasksWaitingForReviewerDecision(
      userTasks,
      this.loggedInUser()
    );
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

        if (invitedUser.Projects) {
          invitedUser.Projects.push(project);
        } else {
          invitedUser.Projects = [project];
        }


        this.projectsChanged.next();
      }
    }
  }

  submitTask(taskID: number): void {
    const user = this.loggedInUser();
    if (!user) return;

    const task = this.tasks.find((t) => t.taskID === taskID);

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
    task.submittedBy = user as TeamMember;
    task.updatedAt = new Date(); 

    console.log(`Task ${taskID} submitted by ${user.name}`);

    
    this.projectsChanged.next();

  }
  logout(): void {
    this.loggedInUserWritableSignal.set(null);
  }
}

