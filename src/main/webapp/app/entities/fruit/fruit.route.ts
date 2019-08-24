import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Fruit } from 'app/shared/model/fruit.model';
import { FruitService } from './fruit.service';
import { FruitComponent } from './fruit.component';
import { FruitDetailComponent } from './fruit-detail.component';
import { FruitUpdateComponent } from './fruit-update.component';
import { FruitDeletePopupComponent } from './fruit-delete-dialog.component';
import { IFruit } from 'app/shared/model/fruit.model';

@Injectable({ providedIn: 'root' })
export class FruitResolve implements Resolve<IFruit> {
  constructor(private service: FruitService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IFruit> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Fruit>) => response.ok),
        map((fruit: HttpResponse<Fruit>) => fruit.body)
      );
    }
    return of(new Fruit());
  }
}

export const fruitRoute: Routes = [
  {
    path: '',
    component: FruitComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Fruits'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: FruitDetailComponent,
    resolve: {
      fruit: FruitResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Fruits'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: FruitUpdateComponent,
    resolve: {
      fruit: FruitResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Fruits'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: FruitUpdateComponent,
    resolve: {
      fruit: FruitResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Fruits'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const fruitPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: FruitDeletePopupComponent,
    resolve: {
      fruit: FruitResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Fruits'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
