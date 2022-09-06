import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthGuard } from './core/services/auth.guard';
import { LoginComponent } from './login/login/login.component';
import { MainComponent } from './main/main.component';
import { ScholarComponent } from './scholar/scholar.component';
import { PyramidComponent } from './pyramid/pyramid.component';
import { PyramidTeamComponent } from './pyramid-team/pyramid-team.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'main', component: MainComponent,},
      { path: 'scholar', component: ScholarComponent,},
      { path: 'pyramid', component: PyramidComponent,},
      { path: 'pyramid-team', component: PyramidTeamComponent,},
      { path: '**', redirectTo: 'main', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
