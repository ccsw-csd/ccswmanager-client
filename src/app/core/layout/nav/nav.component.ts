import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../alert-dialog/alert-dialog.component';
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
    public utilsService: UtilsService,) { }

  ngOnInit(): void {
    this.utilsService.getAppVersion().subscribe((result: any) => {
      this.backVersion = result.version;
    });
  }


  gruposAlert() : void {

    this.dialog.open(AlertDialogComponent, {width: '500px', height: '250px', data: {
      titulo: 'Forbidden', 
      informacion: 'You do not have permissions to manage groups. Please contact the support email (ccsw.support@capgemini.com).'}
    });

  }

}
