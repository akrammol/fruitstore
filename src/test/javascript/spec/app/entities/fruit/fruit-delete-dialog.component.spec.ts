/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { FruiteStoreTestModule } from '../../../test.module';
import { FruitDeleteDialogComponent } from 'app/entities/fruit/fruit-delete-dialog.component';
import { FruitService } from 'app/entities/fruit/fruit.service';

describe('Component Tests', () => {
  describe('Fruit Management Delete Component', () => {
    let comp: FruitDeleteDialogComponent;
    let fixture: ComponentFixture<FruitDeleteDialogComponent>;
    let service: FruitService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FruiteStoreTestModule],
        declarations: [FruitDeleteDialogComponent]
      })
        .overrideTemplate(FruitDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FruitDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FruitService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
