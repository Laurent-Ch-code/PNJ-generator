import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentitiesCardComponent } from './identities-card.component';

describe('IdentityCardComponent', () => {
  let component: IdentitiesCardComponent;
  let fixture: ComponentFixture<IdentitiesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentitiesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentitiesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
