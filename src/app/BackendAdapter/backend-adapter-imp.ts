import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ApprovalRequest,
  Project,
  Task,
  UserEssentials,
  Comment,
  Team,
  UserPermissions,
  Invitation,
} from '../app.model';
import { BackendAdapter } from './backend-adapter';
import { inject, Injectable } from '@angular/core';
import { map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendAdapterImp implements BackendAdapter {
  private static mapComments(responseComments: any[]): Comment[] {
    return responseComments.flatMap((responseComment: any) => {
      return {
        commentID: responseComment.commentId,
        commentText: responseComment.commentText,
        createdAt: responseComment.createdAt,
      };
    });
  }

  private static mapApprovalWorkflow(responseApprovalRequest: any) {
    const approvalWorkflow: ApprovalRequest[] = [];

    do {
      let approvalRequest: ApprovalRequest = {
        approvalRequestID: responseApprovalRequest.approvalRequestId,
        status: responseApprovalRequest.status,
        assigned: {
          teamID: responseApprovalRequest.approvingTeam.teamId,
          teamName: responseApprovalRequest.approvingTeam.teamName,
          teamDescription: responseApprovalRequest.approvingTeam.description,
          teamMembers: BackendAdapterImp.mapMembers(responseApprovalRequest.approvingTeam.teamMembers),
        },
        reviewedBy:
          responseApprovalRequest.approaver != null
            ? {
                userID: responseApprovalRequest.approaver.userId,
                name: responseApprovalRequest.approaver.name,
                email: responseApprovalRequest.approaver.email,
              }
            : null,
        comments: BackendAdapterImp.mapComments(
          responseApprovalRequest.comments
        ),
        createdAt: new Date(responseApprovalRequest.createdAt),
        updatedAt: new Date(responseApprovalRequest.updatedAt),
      };

      approvalWorkflow.push(approvalRequest);
      responseApprovalRequest=responseApprovalRequest.nextRequest;
    } while (responseApprovalRequest != null);  

    return approvalWorkflow;
  }

  mapPermissions(responsePermissions: any[]): UserPermissions | any {
    return {
      canSubmitTask:
        responsePermissions.find((Permission) => Permission == 'submitTask') !==
        undefined,
      canAcceptOrRejectTask:
        responsePermissions.find(
          (Permission) => Permission == 'approaveRejectTask'
        ) !== undefined,
    };
  }

  private static mapTasks(
    responseTasks: any[],
    projectID: number,
    projectName: string
  ): Task[] {
    return responseTasks.flatMap<Task>((responseTask) => {
      return {
        projectID: projectID,
        projectName: projectName,
        taskID: responseTask.taskId,
        taskName: responseTask.taskName,
        taskDescription: responseTask.description,
        deadline: new Date(responseTask.deadline),
        assigned: {
          teamID: responseTask.assignedTeam.teamId,
          teamName: responseTask.assignedTeam.teamName,
          teamDescription: responseTask.assignedTeam.description,
          teamMembers: BackendAdapterImp.mapMembers(responseTask.assignedTeam.teamMembers),
        },
        isSubmitted: responseTask.isSubmitted,
        submittedBy:
          responseTask.submittedBy != null
            ? {
                userID: responseTask.submittedBy.userId,
                name: responseTask.submittedBy.name,
                email: responseTask.submittedBy.email,
              }
            : null,
        approvalWorkflow: BackendAdapterImp.mapApprovalWorkflow(
          responseTask.firstApprovalRequest
        ),
        createdAt: new Date(responseTask.createdAt),
        updatedAt: new Date(responseTask.updatedAt),
      };
    });
  }

  private static mapMembers(responseTeamMembers: any[]): UserEssentials[] {
    return responseTeamMembers.flatMap<UserEssentials>((responseTeamMember) => {
      return {
        userID: responseTeamMember.userId,
        name: responseTeamMember.name,
        email: responseTeamMember.email,
      };
    });
  }

  private static mapTeams(responseTeams: any[]): Team[] {
    return responseTeams.flatMap<Team>((responseTeam) => {
      return {
        teamID: responseTeam.teamId,
        teamName: responseTeam.teamName,
        teamDescription: responseTeam.description,
        teamMembers: BackendAdapterImp.mapMembers(responseTeam.teamMembers),
      };
    });
  }

  mapProjects(responseProjects: any[]): Project[] | any {
    //Handling if response has error
    if (typeof responseProjects[0] === 'string') {
      return responseProjects;
    }

    return responseProjects.flatMap<Project>((responseProject) => {
      return {
        projectID: responseProject.projectId,
        projectName: responseProject.projectName,
        projectDescription: responseProject.description,
        tasks: BackendAdapterImp.mapTasks(
          responseProject.tasks,
          responseProject.projectId,
          responseProject.projectName
        ),
        members: BackendAdapterImp.mapMembers(responseProject.members),
        teams: BackendAdapterImp.mapTeams(responseProject.teams),
        createdBy: {
          userID: responseProject.projectManager.userId,
          name: responseProject.projectManager.name,
          email: responseProject.projectManager.email,
        },
        createdAt: new Date(responseProject.createdAt),
        updatedAt: new Date(responseProject.updatedAt),
      };
    });
  }

  mapInvitations(responseInvitations: any[]): Invitation[] {
    //Handling if response has error
    if (typeof responseInvitations[0] === 'string') {
      return responseInvitations;
    }

    return responseInvitations.flatMap<Invitation>((responseInvitation)=>{
        return {
          memberId: responseInvitation.user.userId,
          projectId: responseInvitation.project.projectId,
          invitedBy: {
            userID: responseInvitation.project.projectManager.userId,
            name: responseInvitation.project.projectManager.name,
            email: responseInvitation.project.projectManager.email,
          },
          status: (responseInvitation.isInviteAccepted) ? 'Accepted' : 'Pending'
        }
      }
    );
  }
}
