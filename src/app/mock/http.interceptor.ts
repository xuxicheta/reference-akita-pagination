import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { ContactsService } from '../contacts.service';




@Injectable()
export class MockInterceptor implements HttpInterceptor {
  constructor(
    private contactsService: ContactsService,
  ) {

  }

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
