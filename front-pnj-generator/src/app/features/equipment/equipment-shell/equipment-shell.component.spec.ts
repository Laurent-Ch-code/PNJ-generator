import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentShellComponent } from './equipment-shell.component';

describe('EquipmentShellComponent', () => {
  let component: EquipmentShellComponent;
  let fixture: ComponentFixture<EquipmentShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
