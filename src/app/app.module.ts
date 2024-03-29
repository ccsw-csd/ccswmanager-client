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
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list'

import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CustomDateAdapter } from './core/date-adapter/custom-date-adapter';
import { PersonalComponent } from './personal/personal.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PyramidComponent } from './pyramid/pyramid.component';
import { PyramidTeamComponent } from './pyramid-team/pyramid-team.component';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { InternComponent } from './intern/intern.component';
import { TextDialogComponent } from './intern/text-dialog/text-dialog.component';
import { TimelineComponent } from './intern/timeline/timeline.component';
import { LdapPersonalDialogComponent } from './personal/ldap-personal-dialog/ldap-personal-dialog.component';
import { LdapInternDialogComponent } from './intern/ldap-intern-dialog/ldap-intern-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonalComponent,
    PyramidComponent,
    PyramidTeamComponent,
    InternComponent,
    TextDialogComponent,
    TimelineComponent,
    LdapPersonalDialogComponent,
    LdapInternDialogComponent
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
    MaintenanceModule,
    AgGridModule.withComponents([]),
    MatAutocompleteModule,
    ClipboardModule,
    MatSnackBarModule,
    NgApexchartsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule
  ],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],
  bootstrap: [AppComponent],
})
export class AppModule {
  
  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('es-ES');
  }

 }
