import { FormMaterialModule } from '../../../form-material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared.module';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent },
]

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    SharedModule,
    FormMaterialModule,
    PipesModule,
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class HomeModule { }
