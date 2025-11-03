import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesNew } from './categories-new';

describe('CategoriesNew', () => {
  let component: CategoriesNew;
  let fixture: ComponentFixture<CategoriesNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriesNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
