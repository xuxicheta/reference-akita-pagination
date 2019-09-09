import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HTTP_INTERCEPTORS
} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { ContactsMockService } from './contacts-mock.service';




@Injectable()
export class MockInterceptor implements HttpInterceptor {
  constructor(
    private contactsService: ContactsMockService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('contacts')) {
      const page = +req.params.get('page') || 0;
      return of(new HttpResponse({
        status: 200,
        body: this.contactsService.getPaginatedContacts(page),
      }));
    }

    return next.handle(req);
  }
}

export const mockInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: MockInterceptor,
  multi: true
};
