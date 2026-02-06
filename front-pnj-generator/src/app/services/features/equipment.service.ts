import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Equipment } from '../../models/features/equipment.models';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly requestTimeoutMs = 8000;

  constructor(private http: HttpClient) { }

  getEquipments(universeId: string): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(`${this.apiBaseUrl}/api/universes/${universeId}/equipments`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération des équipements', error))
    );
  }

  createEquipment(universeId: string,equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(`${this.apiBaseUrl}/api/universes/${universeId}/equipments`, equipment).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('création de l\'équipement', error))
    );
  }

  getEquipmentById(universeId: string,id: string): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.apiBaseUrl}/api/universes/${universeId}/equipments/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`récupération de l'équipement ${id}`, error))
    );
  }

  updateEquipment(universeId: string, equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(`${this.apiBaseUrl}/api/universes/${universeId}/equipments/${equipment.id}`, equipment).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`mise à jour de l'équipement ${equipment.id}`, error))
    );
  }

  deleteEquipment(universeId: string,id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/universes/${universeId}/equipments/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`suppression de l'équipement ${id}`, error))
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
