import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MainService } from '../services/main.service';
import { LdapPerson } from './to/LdapPerson';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ldap-dialog',
  templateUrl: './ldap-dialog.component.html',
  styleUrls: ['./ldap-dialog.component.scss']
})
export class LdapDialogComponent implements OnInit {
  ldapToPersons: LdapPerson[] = [];
  personsToLdap: LdapPerson[] = [];
  tabIndex = "0";
  ldapToPersonsCcswbec: LdapPerson[] = [];
  personsCcswbecToLdap: LdapPerson[] = [];

  showSpinner1 = true;
  showSpinner2 = true;
  showSpinner3 = true;
  showSpinner4 = true;

  constructor(
    private mainService: MainService,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<LdapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
    ) { }

  ngOnInit(): void {

    this.mainService.compareLdapToPersons().subscribe((persons) => {
      if (persons) {
        this.showSpinner1 = false;
      }
      this.ldapToPersons = persons;
    });

    this.mainService.comparePersonsToLdap().subscribe((persons) => {
      if (persons) {
        this.showSpinner2 = false;
      }
      this.personsToLdap = persons;
    });

    this.mainService.compareLdapToPersonsBecarios().subscribe((persons) => {
      if (persons) {
        this.showSpinner3 = false;
      }
      this.ldapToPersonsCcswbec = persons;
    });

    this.mainService.comparePersonsToLdapBecarios().subscribe((persons) => {
      if (persons) {
        this.showSpinner4 = false;
      }
      this.personsCcswbecToLdap = persons;
    });

  }

  copyList(contrato : boolean) {
    var persons: String[];
    var list = "";

    this.mainService.findListLdapUsernames(contrato).subscribe((usernames) => {
      persons = usernames;
      persons.forEach(username => {
      list += username + "\n";
      });
      this.clipboard.copy(list.slice(0,-1));

      this.snackbar.open('Se ha copiado la lista al clipboard, ya puede impotar la lista en el CorporateDirectory', '', {
        duration: 5000
      });

    });
  }

  close() {
    this.dialogRef.close();
  }

}
