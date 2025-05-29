import { Injectable, signal } from '@angular/core';
import { dummyTeamMembers, dummyProjects, dummyTasks } from '../members/dummy-members';
import { dummyProjectManager } from '../members/dummy-members';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  type User,
  ApprovalRequest,
  UserEssentials,
} from '../app.model';

export interface Project {
  projectId: number;
  projectName: string;
  description?: string;
  members:UserMember[]
  teams:Team[]
}
export interface ProjectInput {
  projectId?: number;
  projectName: string;
  description?: string;
}
export interface Team {
  teamId: number;
  teamName: string;
  description: string;
  projct :Project;
}
export interface UserMember {
  userId:number;
  name: string;
  email: string;
  password: string;
  isProjectManager:boolean;
}

export interface ProjectDto {
  project_id:number;
  team_id: number;
}


export interface Task {
  taskId: number;
  taskName: string;
  description: string;
  deadline:Date;
  assignedTeam:Team
}

@Injectable({
  providedIn: 'root',
})
export class ProjectManagerService {
  constructor(private http: HttpClient) {}
  private baseUrl = 'http://localhost:8060/ProjectManager';
  private api = 'http://localhost:8060/teamMember';

  private loggedInUserWritableSignal = signal<User | null>(null);
  loggedInUser = this.loggedInUserWritableSignal.asReadonly();

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/getAllProjects`);
  }

  getById(id: number): Observable<Project> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Project>(`${this.baseUrl}/getProject`, { params });
  }

  create(project: ProjectInput): Observable<Project> {
    return this.http.post<Project>(`${this.baseUrl}/createProject`, project);
  }

  delete(id: number): Observable<void> {
    const params = new HttpParams().set('id', id);
    return this.http.delete<void>(`${this.baseUrl}/deleteProject`, { params });
  }
  createInvite(ProjectDto: ProjectDto): Observable<any> {
    return this.http.post<any>(`${this.api}/createInvite`, ProjectDto);
  }
  createTask(task: any): Observable<any> {
    return this.http.post<any>(`${this.api}/createTask?teamId=${task.teamId}&projectId=${task.projectId}`, task);
  }

  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.api}/getAllTeams`);
  }
  getAllUsers(): Observable<UserMember[]> {
    return this.http.get<UserMember[]>(`${this.api}/getAllUsers`);
  }
  

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.api}/getAllTasks`);
  }
  deleteTask(id: number): Observable<void> {
    const params = new HttpParams().set('taskId', id);
    return this.http.delete<void>(`${this.api}/deleteTask`, { params });
  }
  deleteTeam(id: number): Observable<void> {
    const params = new HttpParams().set('id', id);
    return this.http.delete<void>(`${this.api}/deleteTeam`, { params });
  }
  createTeam(team: any): Observable<any> {
    return this.http.post<any>(`${this.api}/createTeam`, team);
  }
  updateTeam(teamId: number ,team: any): Observable<any> {
    return this.http.post<any>(`${this.api}/updateTeam?teamId=${teamId}`, team);
  }



  logIn(user: User) {
    this.loggedInUserWritableSignal.set(user);
  }

  isUserLoggedIn(): boolean {
    return this.loggedInUser() !== null;
  }

  logout(): void {
    this.loggedInUserWritableSignal.set(null);
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
}
