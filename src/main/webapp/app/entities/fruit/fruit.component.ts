import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IFruit } from 'app/shared/model/fruit.model';
import { AccountService } from 'app/core';
import { FruitService } from './fruit.service';

@Component({
  selector: 'jhi-fruit',
  templateUrl: './fruit.component.html'
})
export class FruitComponent implements OnInit, OnDestroy {
  fruits: IFruit[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected fruitService: FruitService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.fruitService
      .query()
      .pipe(
        filter((res: HttpResponse<IFruit[]>) => res.ok),
        map((res: HttpResponse<IFruit[]>) => res.body)
      )
      .subscribe(
        (res: IFruit[]) => {
          this.fruits = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInFruits();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IFruit) {
    return item.id;
  }

  registerChangeInFruits() {
    this.eventSubscriber = this.eventManager.subscribe('fruitListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
