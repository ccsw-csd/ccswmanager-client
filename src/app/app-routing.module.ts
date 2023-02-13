import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthGuard } from './core/services/auth.guard';
import { LoginComponent } from './login/login/login.component';
import { PersonalComponent } from './personal/personal.component';
import { ScholarComponent } from './scholar/scholar.component';
import { PyramidComponent } from './pyramid/pyramid.component';
import { PyramidTeamComponent } from './pyramid-team/pyramid-team.component';
import { RefreshTokenResolverService } from './core/services/refresh-token-resolver.service';



export const DefaultRoutes = [
  {role:'PERSONAL', path: '/personal'},
  {role:'INTERN', path: '/scholar'},
  {role:'MAINTENANCE', path: '/pyramid'},
];

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    resolve: {credentials: RefreshTokenResolverService},
    children: [
      { path: 'personal', component: PersonalComponent,data:{role:['PERSONAL']}},
      { path: 'scholar', component: ScholarComponent,data:{role:['INTERN']}},
      { path: 'pyramid', component: PyramidComponent,data:{role:['PERSONAL']}},
      { path: 'pyramid-team', component: PyramidTeamComponent,data:{role:['PERSONAL']}},
      { path: '**', redirectTo: 'personal', pathMatch: 'full' },
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
