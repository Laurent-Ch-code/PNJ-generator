import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcsCardComponent } from './npcs-card.component';

describe('NpcsCardComponent', () => {
  let component: NpcsCardComponent;
  let fixture: ComponentFixture<NpcsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpcsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpcsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
