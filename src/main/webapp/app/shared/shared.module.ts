import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FruiteStoreSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [FruiteStoreSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [FruiteStoreSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FruiteStoreSharedModule {
  static forRoot() {
    return {
      ngModule: FruiteStoreSharedModule
    };
  }
}
