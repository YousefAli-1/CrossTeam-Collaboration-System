import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, take, tap } from 'rxjs';
import { Invitation, Project, Task, UserPermissions } from '../app.model';
import { BackendAdapterImp } from '../BackendAdapter/backend-adapter-imp';

@Injectable({
  providedIn: 'root',
})
export class TeamMemberHttpService {
  private readonly apiUrl = 'http://localhost:8080/teamMember';
  private readonly mapper = inject(BackendAdapterImp);
  private http = inject(HttpClient);

  submitTask(taskId: number, userId: number): Observable<void> {
    const params = new HttpParams()
      .set('taskId', taskId.toString())
      .set('userId', userId.toString());

    return this.http.post<void>(`${this.apiUrl}/submitTask`, null, { params });
  }

  getProjects(userId: number): Observable<Project[]> {
    const params = new HttpParams().set('userId', userId);

    return this.http.get(`${this.apiUrl}/getProjects`, { params }).pipe(
      map((response: any) => {
        return response;
      }),
      map(this.mapper.mapProjects),
      take(1)
    );
  }

  getUserPermissions(
    projectId: number,
    userId: number
  ): Observable<UserPermissions> {
    const params = new HttpParams()
      .set('projectId', projectId)
      .set('userId', userId);

    return this.http.get(`${this.apiUrl}/getAuthorities`, { params }).pipe(
      map((response: any) => {
        return response;
      }),
      map(this.mapper.mapPermissions),
      take(1)
    );
  }

  getProjectsInvitations(userId: number): Observable<Invitation[]> {
    const params = new HttpParams().set('userId', userId);

    return this.http
      .get(`${this.apiUrl}/getPendingInvitations`, { params })
      .pipe(
        map((reposnse: any) => {
          return reposnse;
        }),
        map(this.mapper.mapInvitations),
        take(1)
      );
  }

  acceptProjectInvitation(projectId: number, userId: number): Observable<void> {
    const params = new HttpParams()
      .set('projectId', projectId)
      .set('userId', userId);

    return this.http.post<void>(`${this.apiUrl}/acceptInvitation`, null, {
      params,
    });
  }

  rejectProjectInvitation(projectId: number, userId: number): Observable<void> {
    const params = new HttpParams()
      .set('projectId', projectId)
      .set('userId', userId);

    return this.http.delete<void>(`${this.apiUrl}/rejectInvitation`, {
      params,
    });
  }
}
