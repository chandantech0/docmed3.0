import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOrderHistoryComponent } from './user-order-history.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared';

const routes: Routes = [
  {
    path: '',
    component: UserOrderHistoryComponent
  }
];

@NgModule({
  declarations: [
    UserOrderHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UserOrderHistoryModule { }
