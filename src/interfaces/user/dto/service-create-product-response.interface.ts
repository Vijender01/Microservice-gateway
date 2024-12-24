import { IProduct } from "src/interfaces/common/create-product.interface";

export interface IServiceProductResponse {
  status: number;
  message: string;
  product: IProduct | null;
  errors: { [key: string]: any };
}
