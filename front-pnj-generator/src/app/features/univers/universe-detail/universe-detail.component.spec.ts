import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniverseDetailComponent } from './universe-detail.component';

describe('UniverseDetailComponent', () => {
  let component: UniverseDetailComponent;
  let fixture: ComponentFixture<UniverseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniverseDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniverseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
