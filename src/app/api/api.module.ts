import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccountService } from './account.service';
import { ErrorHandlerService } from './error-handler.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    AccountService,
    ErrorHandlerService
  ]
})
export class ApiServiceModule { }
