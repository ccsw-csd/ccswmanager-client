import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CenterDto } from 'src/app/core/to/CenterDto';
import { PersonDto } from 'src/app/core/to/PersonDto';
import { PersonRoleDto } from 'src/app/core/to/PersonRoleDto';
import { ProvinceDto } from 'src/app/core/to/ProvinceDto';
import { environment } from 'src/environments/environment';
import { LdapPerson } from '../ldap-dialog/to/LdapPerson';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  constructor(
    private http: HttpClient,
  ) { }


  findPersons() : Observable<PersonDto[]> {
    return this.http.get<PersonDto[]>(environment.server+ '/person/');
  }

  saveOrUpdatePersons(persons: PersonDto[]) : Observable<PersonDto[]> {
    return this.http.post<PersonDto[]>(environment.server+ '/person/', persons);
  }

  findCenters(): Observable<CenterDto[]> {
    return this.http.get<CenterDto[]>(environment.server + '/center/');
  }

  findPersonsByFilter(filter: String): Observable<PersonDto[]> {
    return this.http.get<PersonDto[]>(environment.server + '/person/' + filter);
  }

  findScholarsByFilter(filter: String): Observable<PersonDto[]> {
    return this.http.get<PersonDto[]>(environment.server + '/person/scholar/' + filter);
  }

  checkLDAP(): Observable<boolean>  {
    return this.http.get<boolean>(environment.server + '/ldap/');
  }

  compareLdapToPersons(contract : boolean): Observable<LdapPerson[]> {
    return this.http.get<LdapPerson[]>(environment.server + '/ldap/ldap/' + contract);
  }

  comparePersonsToLdap(contract : boolean): Observable<LdapPerson[]> {
    return this.http.get<LdapPerson[]>(environment.server + '/ldap/persons/' + contract);
  }

  findListLdapUsernames(contract : boolean): Observable<String[]> {
    return this.http.get<String[]>(environment.server + '/ldap/list/' + contract);
  }

  findPersonRoles(): Observable<PersonRoleDto[]> {
    return this.http.get<PersonRoleDto[]>(environment.server + '/person-roles/');
  }

  findProvince(): Observable<ProvinceDto[]> {
    return this.http.get<ProvinceDto[]>(environment.server + '/province/');
  }
}
