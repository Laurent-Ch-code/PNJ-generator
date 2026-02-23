import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcsShellComponent } from './npcs-shell.component';

describe('NpcsShellComponent', () => {
  let component: NpcsShellComponent;
  let fixture: ComponentFixture<NpcsShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpcsShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NpcsShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
