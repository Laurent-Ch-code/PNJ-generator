import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Characteristic } from '../models/characteristic.models';

@Injectable({
  providedIn: 'root'
})
export class CharacteristicService {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly requestTimeoutMs = 10000;

  constructor(private http: HttpClient) {}

  getCharacteristics(universeId: string): Observable<Characteristic[]> {
    return this.http.get<Characteristic[]>(`${this.apiBaseUrl}/api/universes/${universeId}/characteristics`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération des caractéristiques', error))
    );
  }

  getCharacteristicById(universeId: string, id: string): Observable<Characteristic> {
    return this.http.get<Characteristic>(`${this.apiBaseUrl}/api/universes/${universeId}/characteristics/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération de la caractéristique', error))
    );
  }

  createCharacteristic(universeId: string, characteristic: Characteristic): Observable<Characteristic> {
    return this.http.post<Characteristic>(`${this.apiBaseUrl}/api/universes/${universeId}/characteristics`, characteristic).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('création de la caractéristique', error))
    );
  }

  updateCharacteristic(universeId: string, characteristic: Characteristic): Observable<Characteristic> {
    return this.http.put<Characteristic>(`${this.apiBaseUrl}/api/universes/${universeId}/characteristics/${characteristic.id}`, characteristic).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('mise à jour de la caractéristique', error))
    );
  }

  deleteCharacteristic(universeId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/universes/${universeId}/characteristics/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('suppression de la caractéristique', error))
    );
  }

  private handleHttpError(action: string, error: any): Observable<never> {
    console.error(`Erreur lors de ${action}:`, error);
    return throwError(() => error);
  }
}
