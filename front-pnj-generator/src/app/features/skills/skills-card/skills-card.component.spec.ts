import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponsCardComponent } from './weapons-card.component';

describe('WeaponsCardComponent', () => {
  let component: WeaponsCardComponent;
  let fixture: ComponentFixture<WeaponsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaponsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
