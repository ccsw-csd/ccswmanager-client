import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishLevelComponent } from './english-level.component';

describe('EnglishLevelComponent', () => {
  let component: EnglishLevelComponent;
  let fixture: ComponentFixture<EnglishLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishLevelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
