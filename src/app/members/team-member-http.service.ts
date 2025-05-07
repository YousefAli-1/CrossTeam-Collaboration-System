import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../app.model';

@Injectable({
  providedIn: 'root',
})
export class TeamMemberHttpService {
  private readonly apiUrl = 'http://localhost:8080/teamMember';

  constructor(private http: HttpClient) { }

  submitTask(taskId: number, userId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('taskId', taskId.toString());
    formData.append('userId', userId.toString());
    formData.append('file', file);

    return this.http.post<void>(`${this.apiUrl}/${userId}/submit-task`, formData);
  }
  getAllTasks(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${userId}/getAllTasks`);
  }
  getUserTasksForSubmission(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/submitted-task`);
  }
  downloadSubmission(taskId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-submission`, {
      params: new HttpParams().set('taskId', taskId.toString()),
      responseType: 'blob'
    });
  }
}
