import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetsView } from './budgets-view';

describe('BudgetsView', () => {
  let component: BudgetsView;
  let fixture: ComponentFixture<BudgetsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetsView],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
