import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Workout, WorkoutAnalytics } from '../models/workout.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/workouts`;

  getWorkouts(filters?: any): Observable<{ success: boolean; workouts: Workout[] }> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) params = params.append(key, filters[key]);
      });
    }
    return this.http.get<{ success: boolean; workouts: Workout[] }>(this.apiUrl, { params });
  }

  getAnalytics(period: 'week' | 'month' = 'week'): Observable<{ success: boolean; analytics: WorkoutAnalytics }> {
    return this.http.get<{ success: boolean; analytics: WorkoutAnalytics }>(`${this.apiUrl}/analytics`, {
      params: new HttpParams().set('period', period)
    });
  }

  addWorkout(workout: Workout): Observable<{ success: boolean; workout: Workout }> {
    return this.http.post<{ success: boolean; workout: Workout }>(this.apiUrl, workout);
  }

  deleteWorkout(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
