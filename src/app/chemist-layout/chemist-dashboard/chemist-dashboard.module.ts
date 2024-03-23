import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChemistDashboardComponent } from './chemist-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared';
const routes: Routes = [
  {
    path: '',
    component: ChemistDashboardComponent
  }
];

@NgModule({
  declarations: [
    ChemistDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ChemistDashboardModule { }
