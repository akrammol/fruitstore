/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { FruiteStoreTestModule } from '../../../test.module';
import { FruitComponent } from 'app/entities/fruit/fruit.component';
import { FruitService } from 'app/entities/fruit/fruit.service';
import { Fruit } from 'app/shared/model/fruit.model';

describe('Component Tests', () => {
  describe('Fruit Management Component', () => {
    let comp: FruitComponent;
    let fixture: ComponentFixture<FruitComponent>;
    let service: FruitService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FruiteStoreTestModule],
        declarations: [FruitComponent],
        providers: []
      })
        .overrideTemplate(FruitComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FruitComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(FruitService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Fruit(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.fruits[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
