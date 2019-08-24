import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IFruit } from 'app/shared/model/fruit.model';
import { FruitService } from './fruit.service';

@Component({
  selector: 'jhi-fruit-delete-dialog',
  templateUrl: './fruit-delete-dialog.component.html'
})
export class FruitDeleteDialogComponent {
  fruit: IFruit;

  constructor(protected fruitService: FruitService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.fruitService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'fruitListModification',
        content: 'Deleted an fruit'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-fruit-delete-popup',
  template: ''
})
export class FruitDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ fruit }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(FruitDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.fruit = fruit;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/fruit', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/fruit', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
