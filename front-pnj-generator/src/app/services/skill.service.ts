import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Skill } from '../models/skill.models';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly requestTimeoutMs = 10000;

  constructor(private http: HttpClient) {}

  getSkills(universeId: string): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.apiBaseUrl}/api/universes/${universeId}/skills`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération des compétences', error))
    );
  }

  getSkillById(universeId: string, id: string): Observable<Skill> {
    return this.http.get<Skill>(`${this.apiBaseUrl}/api/universes/${universeId}/skills/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération de la compétence', error))
    );
  }

  createSkill(universeId: string, skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(`${this.apiBaseUrl}/api/universes/${universeId}/skills`, skill).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('création de la compétence', error))
    );
  }

  updateSkill(universeId: string, skill: Skill): Observable<Skill> {
    return this.http.put<Skill>(`${this.apiBaseUrl}/api/universes/${universeId}/skills/${skill.id}`, skill).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('mise à jour de la compétence', error))
    );
  }

  deleteSkill(universeId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/universes/${universeId}/skills/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('suppression de la compétence', error))
    );
  }

  private handleHttpError(action: string, error: any): Observable<never> {
    console.error(`Erreur lors de ${action}:`, error);
    return throwError(() => error);
  }
}
