import { ApprovalRequest, Comment, Invitation, Project, Task, Team, UserEssentials, UserPermissions } from '../app.model';

export interface BackendAdapter {
  mapProjects(responseProjects: any[]): Project;
  
  mapPermissions(responsePermissions: any): UserPermissions;

  mapInvitations(responseInvitations: any[]): Invitation[];
}
