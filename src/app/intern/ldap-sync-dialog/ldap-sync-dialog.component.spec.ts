import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapSyncDialogComponent } from './ldap-sync-dialog.component';

describe('LdapSyncDialogComponent', () => {
  let component: LdapSyncDialogComponent;
  let fixture: ComponentFixture<LdapSyncDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LdapSyncDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LdapSyncDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
