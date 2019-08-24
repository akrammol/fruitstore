/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { FruiteStoreTestModule } from '../../../test.module';
import { FruitUpdateComponent } from 'app/entities/fruit/fruit-update.component';
import { FruitService } from 'app/entities/fruit/fruit.service';
import { Fruit } from 'app/shared/model/fruit.model';

describe('Component Tests', () => {
  describe('Fruit Management Update Component', () => {
    let comp: FruitUpdateComponent;
    let fixture: ComponentFixture<FruitUpdateComponent>;
    let service: FruitService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FruiteStoreTestModule],
        declarations: [FruitUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(FruitUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FruitUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FruitService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Fruit(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Fruit();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
