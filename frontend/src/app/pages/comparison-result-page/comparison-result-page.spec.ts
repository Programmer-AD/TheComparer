import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonResultPage } from './comparison-result-page';

describe('ComparisonResultPage', () => {
  let component: ComparisonResultPage;
  let fixture: ComponentFixture<ComparisonResultPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonResultPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparisonResultPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
