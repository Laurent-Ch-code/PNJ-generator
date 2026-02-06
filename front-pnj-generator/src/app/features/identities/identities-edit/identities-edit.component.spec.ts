import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentitiesEditComponent } from './identities-edit.component';

describe('IdentityEditComponent', () => {
  let component: IdentitiesEditComponent;
  let fixture: ComponentFixture<IdentitiesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentitiesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentitiesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
