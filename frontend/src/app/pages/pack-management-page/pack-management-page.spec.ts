import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackManagementPage } from './pack-management-page';

describe('PackManagementPage', () => {
  let component: PackManagementPage;
  let fixture: ComponentFixture<PackManagementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackManagementPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackManagementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
