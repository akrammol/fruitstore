import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IFruit, Fruit } from 'app/shared/model/fruit.model';
import { FruitService } from './fruit.service';

@Component({
  selector: 'jhi-fruit-update',
  templateUrl: './fruit-update.component.html'
})
export class FruitUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [],
    type: [],
    price: []
  });

  constructor(protected fruitService: FruitService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ fruit }) => {
      this.updateForm(fruit);
    });
  }

  updateForm(fruit: IFruit) {
    this.editForm.patchValue({
      id: fruit.id,
      name: fruit.name,
      type: fruit.type,
      price: fruit.price
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const fruit = this.createFromForm();
    if (fruit.id !== undefined) {
      this.subscribeToSaveResponse(this.fruitService.update(fruit));
    } else {
      this.subscribeToSaveResponse(this.fruitService.create(fruit));
    }
  }

  private createFromForm(): IFruit {
    return {
      ...new Fruit(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      type: this.editForm.get(['type']).value,
      price: this.editForm.get(['price']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFruit>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
