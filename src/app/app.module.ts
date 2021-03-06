import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { LoginModule } from './login/login.module';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CustomDateAdapter } from './core/date-adapter/custom-date-adapter';
import { MainComponent } from './main/main.component';
import { AgGridModule } from 'ag-grid-angular';
import { ScholarComponent } from './scholar/scholar.component';
import { LdapDialogComponent } from './main/ldap-dialog/ldap-dialog.component';
import {UsersComponent} from './users/users.component';
import { TimelineDialogComponent } from './scholar/timeline-dialog/timeline-dialog.component'
import { NgApexchartsModule } from "ng-apexcharts";
import { UserDialogComponent } from './users/user-dialog/user-dialog.component'
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomCellButtonComponent } from './users/custom-cell-button/custom-cell-button.component';
import { PyramidComponent } from './pyramid/pyramid.component';
import { PyramidTeamComponent } from './pyramid-team/pyramid-team.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ScholarComponent,
    LdapDialogComponent,
    UsersComponent,
    PyramidComponent,
    TimelineDialogComponent,
    UserDialogComponent,
    CustomCellButtonComponent,
    PyramidTeamComponent,
  ],
  imports: 
  [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatGridListModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTabsModule,
    CoreModule,
    LoginModule,
    AgGridModule.withComponents([CustomCellButtonComponent]),
    MatAutocompleteModule,
    ClipboardModule,
    MatSnackBarModule,
    NgApexchartsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],
  bootstrap: [AppComponent],
})
export class AppModule {

  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('es-ES');
  }

 }
