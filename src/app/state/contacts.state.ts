import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createEntityQuery, createEntityStore, EntityState, ID, PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { Observable } from 'rxjs/internal/Observable';
import { pluck, switchMap } from 'rxjs/operators';

export interface Contact {
  contactId: ID;
  name: string;
}

interface ContactEntityState extends EntityState<Contact, ID> { }

@Injectable({ providedIn: 'root' })
export class ContactsState {
  private store = createEntityStore<ContactEntityState>({}, { name: 'contacts', idKey: 'contactId' });
  private query = createEntityQuery<ContactEntityState>(this.store, {});
  private paginator = new PaginatorPlugin(this.query).withControls().withRange();

  public all$: Observable<Contact[]> = this.query.selectAll();
  public count$: Observable<number> = this.query.selectCount();

  constructor(
    private http: HttpClient,
  ) { }

  private get(page: number): Observable<PaginationResponse<Contact>> {
    console.log(`requesting page number ${page}`);
    const params = new HttpParams().set('page', `${page}`);
    return this.http.get<PaginationResponse<Contact>>('contacts', { params });
  }

  public setPage(page: number): void {
    this.paginator.setPage(page);
  }

  public selectPage(): Observable<PaginationResponse<Contact>> {
    return this.paginator.pageChanges.pipe(
      switchMap(page => this.paginator.getPage(() => this.get(page)))
    );
  }

  public selectPageEntities(): Observable<Contact[]> {
    return this.selectPage().pipe(pluck('data'));
  }

  public selectPageNumber(): Observable<number> {
    return this.selectPage().pipe(pluck('currentPage'));
  }
}

