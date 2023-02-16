import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LdapPersonalDialogComponent } from './ldap-personal-dialog.component';

describe('LdapPersonalDialogComponent', () => {
  let component: LdapPersonalDialogComponent;
  let fixture: ComponentFixture<LdapPersonalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LdapPersonalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LdapPersonalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
