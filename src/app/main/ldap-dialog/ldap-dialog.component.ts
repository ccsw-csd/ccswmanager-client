import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MainService } from '../services/main.service';
import { LdapPerson } from './to/LdapPerson';

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

  close() {
    this.dialogRef.close();
  }

}
