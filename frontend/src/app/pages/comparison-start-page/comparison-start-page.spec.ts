import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonStartPage } from './comparison-start-page';

describe('ComparisonStartPage', () => {
  let component: ComparisonStartPage;
  let fixture: ComponentFixture<ComparisonStartPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonStartPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparisonStartPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
