import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthGuard } from './core/services/auth.guard';
import { LoginComponent } from './login/login/login.component';
import { PersonalComponent } from './personal/personal.component';
import { PyramidComponent } from './pyramid/pyramid.component';
import { PyramidTeamComponent } from './pyramid-team/pyramid-team.component';
import { RefreshTokenResolverService } from './core/services/refresh-token-resolver.service';
import { EducationComponent } from './maintenance/education/education.component';
import { EnglishLevelComponent } from './maintenance/english-level/english-level.component';
import { TechnologyComponent } from './maintenance/technology/technology.component';
import { EducationCenterComponent } from './maintenance/education-center/education-center.component';
import { InternComponent } from './intern/intern.component';



export const DefaultRoutes = [
  {role:'PERSONAL', path: '/personal'},
  {role:'INTERN', path: '/intern'},
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
      { path: 'personal', component: PersonalComponent, data:{role:['PERSONAL']}},
      { path: 'intern', component: InternComponent, data:{role:['INTERN']}},
      { path: 'pyramid', component: PyramidComponent, data:{role:['PERSONAL']}},
      { path: 'pyramid-team', component: PyramidTeamComponent, data:{role:['PERSONAL']}},
      { path: 'education', component: EducationComponent, data:{role:['MAINTENANCE']}},
      { path: 'education-center', component: EducationCenterComponent, data:{role:['MAINTENANCE']}},
      { path: 'level', component: EnglishLevelComponent, data:{role:['MAINTENANCE']}},
      { path: 'technology', component: TechnologyComponent, data:{role:['MAINTENANCE']}},
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
