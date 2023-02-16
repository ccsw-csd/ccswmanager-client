import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapInternDialogComponent } from './ldap-intern-dialog.component';

describe('LdapInternDialogComponent', () => {
  let component: LdapInternDialogComponent;
  let fixture: ComponentFixture<LdapInternDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LdapInternDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LdapInternDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
