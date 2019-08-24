import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFruit } from 'app/shared/model/fruit.model';

@Component({
  selector: 'jhi-fruit-detail',
  templateUrl: './fruit-detail.component.html'
})
export class FruitDetailComponent implements OnInit {
  fruit: IFruit;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ fruit }) => {
      this.fruit = fruit;
    });
  }

  previousState() {
    window.history.back();
  }
}
