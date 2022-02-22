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
        this.stopLoading('loading_1', 'ldap_list');
      }
      this.ldapToPersons = persons;
    });

    this.mainService.comparePersonsToLdap().subscribe((persons) => {
      if (persons) {
        this.stopLoading('loading_2', 'persons_list');
      }
      this.personsToLdap = persons;
    });

  }

  stopLoading(id: string, l_id: string) {
    var loading = document.getElementById(id);
    var list = document.getElementById(l_id);
    if(loading != null) {
      loading.style.display = 'none';
    }
    if(list != null) {
      list.style.display = 'block';
    }
  }

  copyList() {
    var persons: String[];
    var list = "";

    this.mainService.findListLdapUsernames().subscribe((usernames) => {
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
