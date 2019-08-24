export interface IFruit {
  id?: number;
  name?: string;
  type?: string;
  price?: number;
}

export class Fruit implements IFruit {
  constructor(public id?: number, public name?: string, public type?: string, public price?: number) {}
}
