import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { UtilsService } from '../../services/utils.service';
import { version } from '../../../../../package.json';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  frontVersion : string = version;
  backVersion : string = "1.0.0";

  constructor(public authService: AuthService,
    public dialog: MatDialog,
    public utilsService: UtilsService,) {

    }

  ngOnInit(): void {
    this.utilsService.getAppVersion().subscribe((result: any) => {
      this.backVersion = result.version;
    });
  }

}
