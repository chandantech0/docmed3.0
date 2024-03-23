import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChemistProfileComponent } from './chemist-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared';

const routes: Routes = [
  {
    path: '',
    component: ChemistProfileComponent
  }
];

@NgModule({
  declarations: [
    ChemistProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ChemistProfileModule { }
