import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, timeout, catchError } from 'rxjs/operators';
import { Universe } from '../models/universe.models';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})

export class UniverseService {

  private static readonly LS_KEY = 'npcforge.universes.v1';
  constructor(private http: HttpClient) { }

  universes: Universe[] = [];
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly requestTimeoutMs = 8000;


  getUniverses(): Observable<Universe[]> {
    return this.http
      .get<Universe[]>(`${this.apiBaseUrl}/api/universes`)
      .pipe(
        timeout(this.requestTimeoutMs),
        catchError((error) => this.handleHttpError('récupération des univers', error))
      );
  }

  getUniverseById(id: string): Observable<Universe> {
    return this.http
      .get<Universe>(`${this.apiBaseUrl}/api/universes/${id}`)
      .pipe(
        timeout(this.requestTimeoutMs),
        catchError((error) => this.handleHttpError(`récupération de l'univers ${id}`, error))
      );
  }

  addUniverse(universeToCreate: Omit<Universe, 'id'>): Observable<Universe> {
    return this.http
      .post<Universe>(`${this.apiBaseUrl}/api/universes`, universeToCreate)
      .pipe(
        timeout(this.requestTimeoutMs),
        catchError((error) => this.handleHttpError(`création de l'univers`, error))
      );
  }

  updateUniverse(updatedUniverse: Universe): Observable<void> {
    // ton API attend UniverseCreateDto (sans id) => on envoie sans id
    const payload = {
      name: updatedUniverse.name,
      era: updatedUniverse.era,
      description: updatedUniverse.description,
      diceRule: updatedUniverse.diceRule,
    };

    return this.http
      .put<void>(`${this.apiBaseUrl}/api/universes/${updatedUniverse.id}`, payload)
      .pipe(
        timeout(this.requestTimeoutMs),
        catchError((error) => this.handleHttpError(`mise à jour de l'univers ${updatedUniverse.id}`, error))
      );
  }

  deleteUniverse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/universes/${id}`);
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
