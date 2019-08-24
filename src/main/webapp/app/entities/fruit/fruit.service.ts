import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IFruit } from 'app/shared/model/fruit.model';

type EntityResponseType = HttpResponse<IFruit>;
type EntityArrayResponseType = HttpResponse<IFruit[]>;

@Injectable({ providedIn: 'root' })
export class FruitService {
  public resourceUrl = SERVER_API_URL + 'api/fruits';

  constructor(protected http: HttpClient) {}

  create(fruit: IFruit): Observable<EntityResponseType> {
    return this.http.post<IFruit>(this.resourceUrl, fruit, { observe: 'response' });
  }

  update(fruit: IFruit): Observable<EntityResponseType> {
    return this.http.put<IFruit>(this.resourceUrl, fruit, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFruit>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFruit[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
