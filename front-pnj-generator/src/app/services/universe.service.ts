import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Universe } from '../models/universe.models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UniverseService {

  private static readonly LS_KEY = 'npcforge.universes.v1';
  constructor(private http: HttpClient) { }

  universes: Universe[] = [];


  getUniverses(): Observable<Universe[]> {
    const universesFromStorage = this.loadFromLocalStorage();

    if (universesFromStorage.length > 0) {
      this.universes = universesFromStorage;
      return of(this.universes);
    }

    return this.http.get<Universe[]>('/assets/mock/universes.json').pipe(
      tap((universesFromFile: Universe[]) => {
        this.universes = universesFromFile;
        this.saveToLocalStorage(this.universes);
      })
    );
  }

  getUniverseById(id: string): Observable<Universe> {
    // Si la liste est déjà en mémoire, on évite un rechargement
    if (this.universes.length > 0) {
      const universe = this.universes.find(u => u.id === id);
      return universe
        ? of(universe)
        : throwError(() => new Error(`Universe "${id}" not found`));
    }

    // Sinon, on charge la liste (localStorage ou JSON), puis on cherche dedans
    return this.getUniverses().pipe(
      map((universes) => {
        const universe = universes.find(u => u.id === id);
        if (!universe) throw new Error(`Universe "${id}" not found`);
        return universe;
      })
    );
  }

  addUniverse(universeToCreate: Omit<Universe, 'id'>): Universe {
    // S'assure d’avoir une base (utile si tu ajoutes direct sans avoir listé avant)
    if (this.universes.length === 0) {
      this.universes = this.loadFromLocalStorage();
    }

    const createdUniverse: Universe = {
      ...universeToCreate,
      id: crypto.randomUUID(),
    };

    this.universes.push(createdUniverse);
    this.saveToLocalStorage(this.universes);

    return createdUniverse;
  }

  updateUniverse(updatedUniverse: Universe): void {
    const index = this.universes.findIndex(u => u.id === updatedUniverse.id);

    if (index === -1) {
      throw new Error(`Universe with id "${updatedUniverse.id}" not found`);
    }

    this.universes[index] = updatedUniverse;
    this.saveToLocalStorage(this.universes);
  }

  private loadFromLocalStorage(): Universe[] {
    const stored = localStorage.getItem(UniverseService.LS_KEY);
    if (!stored) return [];

    try {
      return JSON.parse(stored) as Universe[];
    } catch {
      return [];
    }
  }

  private saveToLocalStorage(universes: Universe[]): void {
    localStorage.setItem(UniverseService.LS_KEY, JSON.stringify(universes));
  }
}
