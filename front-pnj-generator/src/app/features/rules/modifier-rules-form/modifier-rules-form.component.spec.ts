import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierRulesFormComponent } from './modifier-rules-form.component';

describe('ModifierRulesFormComponent', () => {
  let component: ModifierRulesFormComponent;
  let fixture: ComponentFixture<ModifierRulesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierRulesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierRulesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
