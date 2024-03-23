import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectloginComponent } from './auth/selectlogin/selectlogin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./doctor-layout/doctor-layout.module').then(m => m.DoctorLayoutModule),
    pathMatch: 'full',
    // canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: SelectloginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chemist-login',
    component: SelectloginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'signUp',
    component: SignupComponent
  },
  {
    path: 'resetPassword/:emailId',
    component: ResetPasswordComponent
  },
  {
    path: 'not-found',
    component: NotFoundPageComponent
  },
  {
    path: 'doctor',
    loadChildren: () => import('./doctor-layout/doctor-layout.module').then(m => m.DoctorLayoutModule)
  },
  {
    path: 'chemist',
    loadChildren: () => import('./chemist-layout/chemist-layout.module').then(m => m.ChemistLayoutModule)
  },
  {
    path: '**',
    component: NotFoundPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
