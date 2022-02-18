import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapDialogComponent } from './ldap-dialog.component';

describe('LdapDialogComponent', () => {
  let component: LdapDialogComponent;
  let fixture: ComponentFixture<LdapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LdapDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LdapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
