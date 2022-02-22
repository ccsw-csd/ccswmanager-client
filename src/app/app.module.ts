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
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CustomDateAdapter } from './core/date-adapter/custom-date-adapter';
import { MainComponent } from './main/main.component';
import { AgGridModule } from 'ag-grid-angular';
import { ScholarComponent } from './scholar/scholar.component';
import { LdapDialogComponent } from './main/ldap-dialog/ldap-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ScholarComponent,
    LdapDialogComponent
  ],
  imports: [
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
    CoreModule,
    LoginModule,
    AgGridModule.withComponents([]),
    MatAutocompleteModule,
    ClipboardModule,
    MatSnackBarModule
  ],
  providers: [{ provide: DateAdapter, useClass: CustomDateAdapter }],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('es-ES');
  }

 }
