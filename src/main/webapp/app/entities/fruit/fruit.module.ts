import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FruiteStoreSharedModule } from 'app/shared';
import {
  FruitComponent,
  FruitDetailComponent,
  FruitUpdateComponent,
  FruitDeletePopupComponent,
  FruitDeleteDialogComponent,
  fruitRoute,
  fruitPopupRoute
} from './';

const ENTITY_STATES = [...fruitRoute, ...fruitPopupRoute];

@NgModule({
  imports: [FruiteStoreSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [FruitComponent, FruitDetailComponent, FruitUpdateComponent, FruitDeleteDialogComponent, FruitDeletePopupComponent],
  entryComponents: [FruitComponent, FruitUpdateComponent, FruitDeleteDialogComponent, FruitDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FruiteStoreFruitModule {}
