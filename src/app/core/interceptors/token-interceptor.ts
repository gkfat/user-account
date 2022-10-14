import { General } from 'src/app/core/models';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private storageAccountTag: string = environment.storageAccountTag;

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let account = localStorage.getItem(this.storageAccountTag) || null,
        clonedRequest: HttpRequest<any> = req;

    if ( account ) {
      let parseAccount: General.LoggedInAccount = JSON.parse(account);
      clonedRequest = req.clone({
        headers: req.headers.set('X-Auth-Token', parseAccount.Token),
        body: req.body
      });
    }

    return next.handle(clonedRequest);
  }

}