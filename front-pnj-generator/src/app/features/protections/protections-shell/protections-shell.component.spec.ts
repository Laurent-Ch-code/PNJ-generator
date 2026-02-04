import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponsShellComponent } from './weapons-shell.component';

describe('WeaponsShellComponent', () => {
  let component: WeaponsShellComponent;
  let fixture: ComponentFixture<WeaponsShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeaponsShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeaponsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
