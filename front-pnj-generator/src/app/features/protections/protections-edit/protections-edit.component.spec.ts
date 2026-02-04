import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponsEditComponent } from './weapons-edit.component';

describe('WeaponsEditComponent', () => {
  let component: WeaponsEditComponent;
  let fixture: ComponentFixture<WeaponsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaponsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
