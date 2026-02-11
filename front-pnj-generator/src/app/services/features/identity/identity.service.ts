import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Identity, IdentityCreateDTO } from '../../../models/features/identity/identity.models';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  private readonly http = inject(HttpClient);
  private readonly requestTimeoutMs = 8000;

  private apiUrl(universeId: string): string {
    return `${environment.apiBaseUrl}/api/universes/${universeId}/identities`;
  }

  getIdentities(universeId: string): Observable<Identity[]> {
    return this.http.get<Identity[]>(this.apiUrl(universeId)).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération des identités', error))
    );
  }

  getIdentityById(universeId: string, identityId: string): Observable<Identity> {
    return this.http.get<Identity>(`${this.apiUrl(universeId)}/${identityId}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`récupération de l'identité ${identityId}`, error))
    );
  }

  create(universeId: string, dto: IdentityCreateDTO): Observable<Identity> {
    return this.http.post<Identity>(this.apiUrl(universeId), dto).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('création de l\'identité', error))
    );
  }

  update(universeId: string, identityId: string, dto: IdentityCreateDTO): Observable<Identity> {
    return this.http.put<Identity>(`${this.apiUrl(universeId)}/${identityId}`, dto).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`mise à jour de l'identité ${identityId}`, error))
    );
  }

  delete(universeId: string, identityId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl(universeId)}/${identityId}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`suppression de l'identité ${identityId}`, error))
    );
  }

  private handleHttpError(context: string, error: unknown) {
    if (error instanceof HttpErrorResponse) {
      const details =
        typeof error.error === 'string'
          ? error.error
          : JSON.stringify(error.error);

      const message = `Erreur HTTP (${error.status}) pendant ${context}. ${details || error.message}`;
      return throwError(() => new Error(message));
    }

    return throwError(() => new Error(`Erreur inconnue pendant ${context}.`));
  }
} 
