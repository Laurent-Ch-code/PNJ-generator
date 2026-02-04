/**
 * GUARD DE CONTEXTE UNIVERS
 * 
 * Extrait automatiquement l'universeId depuis la route et le met dans UniverseContextService.
 * Ce guard doit être appliqué sur toutes les routes qui nécessitent un univers.
 * 
 * Usage dans les routes :
 * {
 *   path: ':id',
 *   canActivate: [universeContextGuard],
 *   children: [...]
 * }
 * 
 * Après activation du guard, tous les composants enfants peuvent récupérer
 * l'universeId via :
 * 
 * this.universeContext.getCurrentUniverseId()
 * ou
 * this.universeContext.requireCurrentUniverseId() (throw si null)
 */

import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UniverseContextService } from '../services/universe-context.service';

export const universeContextGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const universeContext = inject(UniverseContextService);
  const router = inject(Router);

  // Extraire universeId de la route (paramètre 'id')
  const universeId = route.paramMap.get('universeId');

  if (universeId) {
    // Définir l'univers dans le service de contexte
    universeContext.setCurrentUniverseId(universeId);
    return true; // Autoriser la navigation
  }

  // Aucun universeId trouvé dans la route
  console.error('❌ Guard universeContextGuard : Aucun universeId dans la route', route);

  // Rediriger vers la liste des univers
  router.navigate(['/universes']);
  return false; // Bloquer la navigation
};
