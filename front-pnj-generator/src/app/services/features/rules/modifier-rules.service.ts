import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ModifierRules } from '../../../models/rules/modifier_rules.models';

@Injectable({
  providedIn: 'root'
})
export class ModifierRuleService {

  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly requestTimeoutMs = 8000;

  constructor(private http: HttpClient) { }

  // Récupère les règles globales d'un univers (characteristicId = null)
  getByUniverse(universeId: string): Observable<ModifierRules[]> {
    return this.http.get<ModifierRules[]>(`${this.apiBaseUrl}/api/universes/${universeId}/modifier-rules`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération des règles de modificateurs', error))
    );
  }

  // Récupère les règles spécifiques à une caractéristique
  getByCharacteristic(universeId: string, characteristicId: string): Observable<ModifierRules[]> {
    return this.http.get<ModifierRules[]>(`${this.apiBaseUrl}/api/universes/${universeId}/modifier-rules/characteristic/${characteristicId}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération des règles de modificateurs de la caractéristique', error))
    );
  }

  createModifierRule(universeId: string, modifierRule: ModifierRules): Observable<ModifierRules> {
    console.log("UniverseId", universeId, "ModifierRule", modifierRule);
    return this.http.post<ModifierRules>(`${this.apiBaseUrl}/api/universes/${universeId}/modifier-rules`, modifierRule).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('création de la règle de modificateur', error))
    );
  }

  updateModifierRule(universeId: string, modifierRule: ModifierRules): Observable<ModifierRules> {
    return this.http.put<ModifierRules>(`${this.apiBaseUrl}/api/universes/${universeId}/modifier-rules/${modifierRule.id}`, modifierRule).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`mise à jour de la règle de modificateur ${modifierRule.id}`, error))
    );
  }

  deleteModifierRule(universeId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/universes/${universeId}/modifier-rules/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`suppression de la règle de modificateur ${id}`, error))
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
