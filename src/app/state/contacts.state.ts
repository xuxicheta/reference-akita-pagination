import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActiveState, createEntityQuery, createEntityStore, EntityState, ID, PaginationResponse, PaginatorPlugin } from '@datorama/akita';
import { Observable } from 'rxjs/internal/Observable';
import { pluck, switchMap } from 'rxjs/operators';

export interface Contact {
  contactId: ID;
  name: string;
}

function createInitialState() {
  return {
    activePage: null,
  };
}

interface ContactEntityState extends EntityState<Contact>, ActiveState { }

@Injectable({ providedIn: 'root' })
export class ContactsState {
  private store = createEntityStore<ContactEntityState>(createInitialState(), { name: 'contacts', idKey: 'contactId' });
  private query = createEntityQuery<ContactEntityState>(this.store, {});
  private paginator = new PaginatorPlugin(this.query).withControls().withRange();

  public all$: Observable<Contact[]> = this.query.selectAll();
  public count$: Observable<number> = this.query.selectCount();

  public active$ = this.query.selectActive() as Observable<Contact>;
  public pageChanges: Observable<number> = this.paginator.pageChanges;

  get active(): Contact {
    return this.query.getActive() as Contact;
  }

  constructor(
    private http: HttpClient,
  ) { }

  private get(page: number): Observable<PaginationResponse<Contact>> {
    console.log(`requested page number ${page}`);
    const params = new HttpParams().set('page', `${page}`);
    return this.http.get<PaginationResponse<Contact>>('contacts', { params });
  }

  public setPage(page: number): void {
    this.paginator.setPage(page);
  }

  public selectPage(): Observable<PaginationResponse<Contact>> {
    return this.pageChanges.pipe(
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

