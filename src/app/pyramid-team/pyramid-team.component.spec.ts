import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidTeamComponent } from './pyramid-team.component';

describe('PyramidTeamComponent', () => {
  let component: PyramidTeamComponent;
  let fixture: ComponentFixture<PyramidTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PyramidTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
