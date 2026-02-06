import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentitiesShellComponent } from './identities-shell.component';

describe('IdentityShellComponent', () => {
  let component: IdentitiesShellComponent;
  let fixture: ComponentFixture<IdentitiesShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentitiesShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentitiesShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
