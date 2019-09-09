import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationResponse } from '@datorama/akita';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { Contact, ContactsState } from 'src/app/state/contacts.state';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit, OnDestroy {
  contactsPage$: Observable<PaginationResponse<Contact>> = this.contactsState.selectPage();
  contacts$: Observable<Contact[]> = this.contactsState.selectPageEntities();
  pageNumbers$ = this.readNumbers();
  activePageNumber$: Observable<number> = this.contactsState.selectPageNumber();

  constructor(
    private contactsState: ContactsState,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.routerReaction();
  }

  ngOnDestroy() { }

  onPageClick(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page,
      }
    });
  }

  private routerReaction(): void {
    this.route.queryParamMap.pipe(
      map(paramMap => +paramMap.get('page') || 0),
      untilDestroyed(this),
    )
      .subscribe(page => this.contactsState.setPage(page));
  }

  private readNumbers(): Observable<number[]> {
    return this.contactsPage$.pipe(
      map(page => Array.from(Array(page.lastPage).keys()))
    );
  }



}
