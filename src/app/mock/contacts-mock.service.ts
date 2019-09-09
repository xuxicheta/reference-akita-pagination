import { Injectable } from '@angular/core';
import { Contact } from 'src/app/state/contacts.state';
import { name as fakeName } from 'faker';
import { PaginationResponse } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class ContactsMockService {
  readonly maxPages = 10;
  private pages: Map<number, Contact[]> = new Map();

  constructor() { }

  private makeContact(id: number): Contact {
    return {
      contactId: id,
      name: fakeName.firstName(),
    };
  }

  private makePage(page: number) {
    if (!this.pages.has(page)) {
      this.pages.set(page, Array.from(Array(10)).map((el, i) => this.makeContact(page * 10 + i)));
    }
    return this.pages.get(page);
  }

  private getPage(page: number) {
    if (page < this.maxPages) {
      return this.makePage(page);
    }
  }

  public getPaginatedContacts(currentPage: number): PaginationResponse<Contact> {
    return {
      currentPage,
      perPage: 10,
      lastPage: this.maxPages,
      data: this.getPage(currentPage),
    };
  }
}
