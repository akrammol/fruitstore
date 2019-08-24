/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FruiteStoreTestModule } from '../../../test.module';
import { FruitDetailComponent } from 'app/entities/fruit/fruit-detail.component';
import { Fruit } from 'app/shared/model/fruit.model';

describe('Component Tests', () => {
  describe('Fruit Management Detail Component', () => {
    let comp: FruitDetailComponent;
    let fixture: ComponentFixture<FruitDetailComponent>;
    const route = ({ data: of({ fruit: new Fruit(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FruiteStoreTestModule],
        declarations: [FruitDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(FruitDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FruitDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.fruit).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
