import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversesListComponent } from './univers-list.component';

describe('UniversListComponent', () => {
  let component: UniversesListComponent;
  let fixture: ComponentFixture<UniversesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
