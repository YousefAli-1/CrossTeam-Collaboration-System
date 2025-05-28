import { Injectable, signal } from '@angular/core';
import { dummyTeamMembers, dummyProjects, dummyTasks } from '../members/dummy-members';
import { dummyProjectManager } from '../members/dummy-members';
import {
  type User,
  type Project,
  type Task,
  ApprovalRequest,
  UserEssentials,
} from '../app.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectManagerService {
  private readonly teamMembers = dummyTeamMembers;
  private readonly projectManagers = dummyProjectManager;
  private readonly projects = dummyProjects;
  private readonly tasks = dummyTasks;

  private loggedInUserWritableSignal = signal<User | null>(null);
  loggedInUser = this.loggedInUserWritableSignal.asReadonly();

  getProjectByProjectId(id: number) {
    return this.projects.find((project) => project.projectID === id);
  }

  getProjectsByUserId(userId: number): Project[] {
    return this.projects.filter((project) =>
      project.createdBy.userID
    );
    //
  }
  logIn(user: User){
    this.loggedInUserWritableSignal.set(user);
  }
  getMembersByProjectId(id: number): UserEssentials[] {
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



}