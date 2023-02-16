import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LdapPerson } from 'src/app/core/to/LdapPerson';
import { PersonalService } from '../services/personal.service';

@Component({
  selector: 'app-ldap-personal-dialog',
  templateUrl: './ldap-personal-dialog.component.html',
  styleUrls: ['./ldap-personal-dialog.component.scss']
})
export class LdapPersonalDialogComponent implements OnInit {

  ldapToPersons: LdapPerson[] = [];
  personsToLdap: LdapPerson[] = [];

  showSpinner1 = true;
  showSpinner2 = true;

  constructor(
    private personalService: PersonalService,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<LdapPersonalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
    ) { }

  ngOnInit(): void {

    this.personalService.compareLdapToPersons().subscribe((persons) => {
      if (persons) {
        this.showSpinner1 = false;
      }
      this.ldapToPersons = persons;
    });

    this.personalService.comparePersonsToLdap().subscribe((persons) => {
      if (persons) {
        this.showSpinner2 = false;
      }
      this.personsToLdap = persons;
    });

  }

  copyList(contract : boolean) {
    var persons: String[];
    var list = "";

    this.personalService.findListLdapUsernames().subscribe((usernames) => {
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
