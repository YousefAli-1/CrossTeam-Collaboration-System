import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamMemberHttpService {
  private readonly apiUrl = 'http://localhost:8080/teamMember';

  constructor(private http: HttpClient) {}

  submitTask(taskId: number, userId: number): Observable<void> {
    const params = new HttpParams()
      .set('taskId', taskId.toString())
      .set('userId', userId.toString());

    return this.http.post<void>(`${this.apiUrl}/submitTask`, null, { params });
  }

}
