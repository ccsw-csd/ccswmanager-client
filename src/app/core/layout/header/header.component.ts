import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/login/services/login.service';
import { PersonDto } from '../../to/PersonDto';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { environment } from 'src/environments/environment';
import { UserInfoSSO } from '../../to/UserInfoSSO';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user : UserInfoSSO | null = null;
  navOpen = true;
  isloading : boolean = false;
  person: PersonDto = new PersonDto();
  @Output() navOpenEvent = new EventEmitter();

  constructor(
    public authService: AuthService,
    private loginService: LoginService,
    private snackbarService: SnackbarService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUserInfo();
  }

  toggleSideNav() {
    this.navOpen = !this.navOpen;
    this.navOpenEvent.emit(this.navOpen);
  }

  getName() : string {
    if (this.user == null) return "";

    let name : string = this.user.displayName;

    return name;
  }

  logout() {
    this.authService.logout();
  }

  getEmailRef() {
    let gitWord2 = "ge";
    let gitWord4 = "i";
    let gitWord3 = "min";
    let gitWord1 = "cap";

    let gitWord = gitWord1+gitWord2+gitWord3+gitWord4;

    return "mailto:ccsw.support@"+gitWord+".com?subject=["+environment.appCode+"] Consulta / Feedback";
  }
}
