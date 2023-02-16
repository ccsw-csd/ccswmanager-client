import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LdapPerson } from 'src/app/core/to/LdapPerson';
import { InternService } from '../services/intern.service';

@Component({
  selector: 'app-ldap-intern-dialog',
  templateUrl: './ldap-intern-dialog.component.html',
  styleUrls: ['./ldap-intern-dialog.component.scss']
})
export class LdapInternDialogComponent implements OnInit {

  ldapToInterns: LdapPerson[] = [];
  internsToLdap: LdapPerson[] = [];

  showSpinner1 = true;
  showSpinner2 = true;

  constructor(
    private internService: InternService,
    private clipboard: Clipboard,
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<LdapInternDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
    ) { }

  ngOnInit(): void {

    this.internService.compareLdapToInterns().subscribe((interns) => {
      if (interns) {
        this.showSpinner1 = false;
      }
      this.ldapToInterns = interns;
    });

    this.internService.compareInternsToLdap().subscribe((interns) => {
      if (interns) {
        this.showSpinner2 = false;
      }
      this.internsToLdap = interns;
    });

  }

  copyList(contract : boolean) {
    var persons: String[];
    var list = "";

    this.internService.findListLdapUsernames().subscribe((usernames) => {
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
