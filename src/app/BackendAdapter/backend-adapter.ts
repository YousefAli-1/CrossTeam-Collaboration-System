import { ApprovalRequest, Comment, Invitation, Project, Task, Team, UserEssentials, UserPermissions } from '../app.model';

export interface BackendAdapter {
  mapComment(responseComment: any): Comment;

  mapApprovalWorkflow(responseApprovalRequest: any): ApprovalRequest[];

  mapTask(responseTask: any, projectID: number, projectName: string): Task;

  mapProjects(responseProjects: any[]): Project;

  mapTeam(responseTeam: any): Team;

  mapTeamMember(responseTeamMember : any) : UserEssentials;
  
  mapPermissions(responsePermissions: any): UserPermissions;

  mapInvitations(responseInvitations: any[]): Invitation[];
}
