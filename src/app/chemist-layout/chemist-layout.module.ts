import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChemistLayoutComponent } from './chemist-layout.component';
import { SharedModule } from '../shared';
import { ChemistLayoutRouteRoutingModule } from './chemist-layout-route-routing.module';



@NgModule({
  declarations: [
    ChemistLayoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChemistLayoutRouteRoutingModule
  ]
})
export class ChemistLayoutModule { }
