/**
 * SERVICE DE CONTEXTE UNIVERS
 * 
 * Garde en mémoire l'univers actuellement sélectionné.
 * Permet à tous les composants d'accéder facilement à l'universeId courant
 * sans avoir à le récupérer depuis la route à chaque fois.
 * 
 * Usage :
 * - Le guard universeContextGuard set automatiquement l'univers depuis la route
 * - Les composants récupèrent l'univers via getCurrentUniverseId()
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniverseContextService {

  // Subject qui stocke l'universeId actuel
  private currentUniverseIdSubject = new BehaviorSubject<string | null>(null);

  // Observable public pour s'abonner aux changements d'univers
  public currentUniverseId$: Observable<string | null> = this.currentUniverseIdSubject.asObservable();

  constructor() { }

  /**
   * Définit l'univers actuel
   * Appelé automatiquement par le guard universeContextGuard
   */
  setCurrentUniverseId(universeId: string | null): void {
    console.log('🌍 Univers actuel défini :', universeId);
    this.currentUniverseIdSubject.next(universeId);
  }

  /**
   * Récupère l'univers actuel (synchrone)
   * 
   * @returns L'ID de l'univers actuel ou null si aucun univers sélectionné
   * 
   * @example
   * const universeId = this.universeContext.getCurrentUniverseId();
   * if (universeId) {
   *   this.weaponService.getWeapons(universeId).subscribe(...);
   * }
   */
  getCurrentUniverseId(): string | null {
    return this.currentUniverseIdSubject.value;
  }

  /**
   * Récupère l'univers actuel ou throw une erreur si non défini
   * Utilise cette méthode quand tu es SÛR qu'un univers doit être sélectionné
   * 
   * @throws Error si aucun univers n'est sélectionné
   * 
   * @example
   * const universeId = this.universeContext.requireCurrentUniverseId();
   * this.weaponService.getWeapons(universeId).subscribe(...);
   */
  requireCurrentUniverseId(): string {
    const universeId = this.currentUniverseIdSubject.value;
    if (!universeId) {
      throw new Error('Aucun univers sélectionné dans le contexte');
    }
    return universeId;
  }

  /**
   * Vérifie si un univers est sélectionné
   * 
   * @returns true si un univers est défini, false sinon
   */
  hasCurrentUniverse(): boolean {
    return this.currentUniverseIdSubject.value !== null;
  }

  /**
   * Efface l'univers actuel
   * Utile lors de la navigation vers la liste des univers
   */
  clearCurrentUniverse(): void {
    console.log('🌍 Univers actuel effacé');
    this.currentUniverseIdSubject.next(null);
  }
}
