import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamMemberHttpService {
  private readonly apiUrl = 'http://localhost:8080/teamMember';

  constructor(private http: HttpClient) {}

  submitTask(taskId: number, userId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('taskId', taskId.toString());
    formData.append('userId', userId.toString());
    formData.append('file', file);
  
    return this.http.post<void>(`${this.apiUrl}/submit-task`, formData);
  }
}
