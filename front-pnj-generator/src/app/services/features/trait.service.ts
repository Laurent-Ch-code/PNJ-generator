import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Trait } from '../../models/features/trait.models';

@Injectable({
  providedIn: 'root'
})
export class TraitService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly requestTimeoutMs = 10000;

  constructor(private http: HttpClient) {}

  getTraits(universeId: string): Observable<Trait[]> {
    return this.http.get<Trait[]>(`${this.apiBaseUrl}/api/universes/${universeId}/traits`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération des traits', error))
    );
  }

  getTraitById(universeId: string, id: string): Observable<Trait> {
    return this.http.get<Trait>(`${this.apiBaseUrl}/api/universes/${universeId}/traits/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération du trait', error))
    );
  }

  createTrait(universeId: string, trait: Trait): Observable<Trait> {
    return this.http.post<Trait>(`${this.apiBaseUrl}/api/universes/${universeId}/traits`, trait).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('création du trait', error))
    );
  }

  updateTrait(universeId: string, trait: Trait): Observable<Trait> {
    return this.http.put<Trait>(`${this.apiBaseUrl}/api/universes/${universeId}/traits/${trait.id}`, trait).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('mise à jour du trait', error))
    );
  }

  deleteTrait(universeId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/universes/${universeId}/traits/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('suppression du trait', error))
    );
  }

  private handleHttpError(action: string, error: any): Observable<never> {
    console.error(`Erreur lors de ${action}:`, error);
    return throwError(() => error);
  }
}
