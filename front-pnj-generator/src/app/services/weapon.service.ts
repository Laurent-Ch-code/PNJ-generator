import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Weapon } from '../models/weapon.models';
import { Universe } from '../models/universe.models';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly requestTimeoutMs = 8000;
  constructor(private http: HttpClient) { }

  getWeapons(universeId: string): Observable<Weapon[]> {
    return this.http.get<Weapon[]>(`${this.apiBaseUrl}/api/universes/${universeId}/weapons`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération des armes', error))
    );
  }

  createWeapon(weapon: Weapon, universeId: string): Observable<Weapon> {
    return this.http.post<Weapon>(`${this.apiBaseUrl}/api/universes/${universeId}/weapons`, weapon).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('création de l\'arme', error))
    );
  }

  getWeaponById(id: string, universeId: string): Observable<Weapon> {
    return this.http.get<Weapon>(`${this.apiBaseUrl}/api/universes/${universeId}/weapons/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`récupération de l'arme ${id}`, error))
    );
  }

  // ✅ CORRIGÉ : Le backend renvoie NoContent (204), donc on attend void
  updateWeapon(weapon: Weapon, universeId: string): Observable<Weapon> {
    console.log('Mise à jour de l\'arme avant appel:', weapon);
    return this.http.put<Weapon>(`${this.apiBaseUrl}/api/universes/${universeId}/weapons/${weapon.id}`, weapon).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`mise à jour de l\'arme ${weapon.id}`, error))
    );
  }

  deleteWeapon(id: string, universeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/universes/${universeId}/weapons/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`suppression de l'arme ${id}`, error))
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
