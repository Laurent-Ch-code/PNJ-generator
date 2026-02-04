import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Protection } from '../models/protection.models';

@Injectable({
  providedIn: 'root'
})
export class ProtectionService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly requestTimeoutMs = 10000;

  constructor(private http: HttpClient) {}

  getProtections(universeId: string): Observable<Protection[]> {
    return this.http.get<Protection[]>(`${this.apiBaseUrl}/api/universes/${universeId}/protections`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération des protections', error))
    );
  }

  getProtectionById(universeId: string, id: string): Observable<Protection> {
    return this.http.get<Protection>(`${this.apiBaseUrl}/api/universes/${universeId}/protections/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération de la protection', error))
    );
  }

  createProtection(universeId: string, protection: Protection): Observable<Protection> {
    return this.http.post<Protection>(`${this.apiBaseUrl}/api/universes/${universeId}/protections`, protection).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('création de la protection', error))
    );
  }

  updateProtection(universeId: string, protection: Protection): Observable<Protection> {
    return this.http.put<Protection>(`${this.apiBaseUrl}/api/universes/${universeId}/protections/${protection.id}`, protection).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('mise à jour de la protection', error))
    );
  }

  deleteProtection(universeId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/universes/${universeId}/protections/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('suppression de la protection', error))
    );
  }

  private handleHttpError(action: string, error: any): Observable<never> {
    console.error(`Erreur lors de ${action}:`, error);
    return throwError(() => error);
  }
}
