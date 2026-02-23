import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcsEditComponent } from './npcs-edit.component';

describe('NpcsEditComponent', () => {
  let component: NpcsEditComponent;
  let fixture: ComponentFixture<NpcsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpcsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpcsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
