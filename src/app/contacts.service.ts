import { Injectable } from '@angular/core';
import { Contact } from 'src/app/state/contacts.state';
import * as faker from 'faker';
import { PaginationResponse } from '@datorama/akita';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  readonly maxPages = 10;
  pages: Record<number, Contact[]> = {};

  constructor() { }

  private makeContact(id: number): Contact {
    return {
      contactId: id,
      name: faker.name.firstName(),
    };
  }

  private makePage(page: number) {
    if (!this.pages[page]) {
      this.pages[page] = Array.from(Array(10)).map((el, i) => this.makeContact(page * 10 + i));
    }
    return this.pages[page];
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
