import { Injectable, signal } from '@angular/core';
import { dummyTeamMembers, dummyProjects, dummyTasks } from '../members/dummy-members';
import { dummyProjectManager } from '../members/dummy-members';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
export class ProjectManagerService {
  constructor(private http: HttpClient) {}
  private readonly projectManagers = dummyProjectManager;
  private readonly projects = dummyProjects;
  private readonly tasks = dummyTasks;

  private loggedInUserWritableSignal = signal<User | null>(null);
  loggedInUser = this.loggedInUserWritableSignal.asReadonly();

// getProjectByProjectId(id: number): Observable<Project> {
//   return this.http.get<Project>(`http://localhost:8060/ProjectManager/getProject?id=${id}`);
// }
//   getAllProjects(): Observable<Project[]> {
//   return this.http.get<Project[]>(`http://localhost:8060/project/getAll`);
// }
//   logIn(user: User){
//     this.loggedInUserWritableSignal.set(user);
//   }

 isUserLoggedIn(): boolean {
    if (this.loggedInUser()) {
      return true;
    } else {
      return false;
    }
  }
    logout(): void {
    this.loggedInUserWritableSignal.set(null);
  }

}