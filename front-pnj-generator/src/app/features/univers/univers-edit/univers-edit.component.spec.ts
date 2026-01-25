import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniverseEditComponent } from './univers-edit.component';

describe('UniversEditComponent', () => {
  let component: UniverseEditComponent;
  let fixture: ComponentFixture<UniverseEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniverseEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniverseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
