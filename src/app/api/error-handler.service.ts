import { General } from 'src/app/core/models/general';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorHandlerService {
  
  constructor(
    private http: HttpClient,
    private translateServ: TranslateService
  ) { }

  // API 錯誤處理
  public HttpErrorHandle(err: General.APIResult<any>) {
    if ( err.Message !== undefined ) {
      alert(err.Message);
    } else {
      alert(this.translateServ.instant('ALERT.UNKNOWN_ERROR'));
    }
  }

}
