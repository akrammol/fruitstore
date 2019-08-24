import { NgModule } from '@angular/core';

import { FruiteStoreSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
  imports: [FruiteStoreSharedLibsModule],
  declarations: [JhiAlertComponent, JhiAlertErrorComponent],
  exports: [FruiteStoreSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class FruiteStoreSharedCommonModule {}
