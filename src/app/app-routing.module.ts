import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { AuthGuard } from './core/services/auth.guard';
import { UserResolverService } from './core/services/user-resolver.service';
import { LoginComponent } from './login/login/login.component';
import { MainComponent } from './main/main.component';
import { ScholarComponent } from './scholar/scholar.component';
import { UsersComponent } from './users/users.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    resolve: {user: UserResolverService},
    children: [
      { path: 'main', component: MainComponent,},
      { path: 'scholar', component: ScholarComponent,},
      { path: 'users', component: UsersComponent,},
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
