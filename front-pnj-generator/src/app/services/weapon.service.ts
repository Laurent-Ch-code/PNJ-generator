import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Weapon } from '../models/weapon.models';

@Injectable({
  providedIn: 'root'
})
export class WeaponService {

  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly requestTimeoutMs = 8000;
  constructor(private http: HttpClient) { }

  getWeapons(): Observable<Weapon[]> {
    return this.http.get<Weapon[]>(`${this.apiBaseUrl}/api/weapons`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération des armes', error))
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
