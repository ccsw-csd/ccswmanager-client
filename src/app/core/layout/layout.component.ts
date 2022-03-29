import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit { 

  @ViewChild('sidenav') 
  private sideNav?: MatSidenav;

  openNav? : boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private authService: AuthService,
    public dialog: MatDialog,
    public router: Router,
    ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => { 
      this.authService.putUserInfo(response.user); 
      this.checkUserDetails();
    }); 
  }

  private checkUserDetails() : void {
    let user = this.authService.getUserInfo();

    if (user == null || user.username == null || user.role == null) {
      this.authService.clearCredentials();
      this.router.navigate(['login']);
    }
  }

  public toggleMenu() : void {
    this.sideNav?.toggle();
    this.openNav = this.sideNav?.opened;
  }

  
  
}
