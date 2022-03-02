import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineDialogComponent } from './timeline-dialog.component';

describe('TimelineDialogComponent', () => {
  let component: TimelineDialogComponent;
  let fixture: ComponentFixture<TimelineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
