import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { NPC } from '../models/features/npc.models';

@Injectable({
  providedIn: 'root'
})
export class NPCService {

  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly requestTimeoutMs = 8000;

  constructor(private http: HttpClient) { }

  /**
   * Récupère tous les NPCs d'un univers
   */
  getNPCs(universeId: string): Observable<NPC[]> {
    return this.http.get<NPC[]>(`${this.apiBaseUrl}/api/universes/${universeId}/npcs`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('récupération des NPCs', error))
    );
  }

  /**
   * Récupère un NPC spécifique
   */
  getNPCById(universeId: string, id: string): Observable<NPC> {
    return this.http.get<NPC>(`${this.apiBaseUrl}/api/universes/${universeId}/npcs/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`récupération du NPC ${id}`, error))
    );
  }

  /**
   * Génère un nouveau NPC aléatoirement
   */
  generateNPC(universeId: string): Observable<NPC> {
    return this.http.post<NPC>(`${this.apiBaseUrl}/api/universes/${universeId}/npcs/generate`, {}).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError('génération du NPC', error))
    );
  }

  /**
   * Met à jour un NPC existant
   */
  updateNPC(universeId: string, npc: NPC): Observable<NPC> {
    return this.http.put<NPC>(`${this.apiBaseUrl}/api/universes/${universeId}/npcs/${npc.id}`, npc).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`mise à jour du NPC ${npc.id}`, error))
    );
  }

  /**
   * Supprime un NPC
   */
  deleteNPC(universeId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/universes/${universeId}/npcs/${id}`).pipe(
      timeout(this.requestTimeoutMs),
      catchError((error) => this.handleHttpError(`suppression du NPC ${id}`, error))
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
