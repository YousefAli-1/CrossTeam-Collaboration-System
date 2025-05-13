import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, take } from 'rxjs';
import { Invitation, Project, UserPermissions } from '../app.model';
import { BackendAdapterImp } from '../BackendAdapter/backend-adapter-imp';


@Injectable({
  providedIn: 'root',
})
export class TeamMemberHttpService {
  private readonly apiUrl = 'http://localhost:8080/teamMember';
  private readonly mapper = inject(BackendAdapterImp);
  private http = inject(HttpClient);

  submitTask(taskId: number, userId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('taskId', taskId.toString());
    formData.append('userId', userId.toString());
    formData.append('file', file);

    return this.http.post<void>(`${this.apiUrl}/submit-task?userId=${userId}`, formData);
  }
  getAllTasks(userId: number): Observable<Task[]> {
      return this.http.get<Task[]>(`${this.apiUrl}/getAllTasks?userId=${userId}`);
  }
  getUserTasksForSubmission(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/submitted-task?userId=${userId}`);
  }
  getUserTasksForReview(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/review-task?userId=${userId}`);
  }
  downloadSubmission(taskId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-submission`, {
      params: new HttpParams().set('taskId', taskId.toString()),
      responseType: 'blob'
    });
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

    return this.http
      .post<void>(`${this.apiUrl}/acceptInvitation`, null, {
        params,
      })
      .pipe(take(1));
  }

  rejectProjectInvitation(projectId: number, userId: number): Observable<void> {
    const params = new HttpParams()
      .set('projectId', projectId)
      .set('userId', userId);

    return this.http
      .delete<void>(`${this.apiUrl}/rejectInvitation`, {
        params,
      })
      .pipe(take(1));
  }

  acceptApprovalRequest(
    approvalRequestId: number,
    userId: number
  ): Observable<void> {
    const params = new HttpParams()
      .set('approvalRequestId', approvalRequestId)
      .set('userId', userId);

    return this.http
      .post<void>(`${this.apiUrl}/acceptApprovalRequest`, null, {
        params,
      })
      .pipe(take(1));
  }

  rejectApprovalRequest(
    approvalRequestId: number,
    userId: number,
    comment: string | null
  ): Observable<void> {
    const params = new HttpParams()
      .set('approvalRequestId', approvalRequestId)
      .set('userId', userId)
      .set('comment', comment || '');

    return this.http
      .post<void>(`${this.apiUrl}/rejectApprovalRequest`, null, {
        params,
      })
      .pipe(take(1));
  }

}
