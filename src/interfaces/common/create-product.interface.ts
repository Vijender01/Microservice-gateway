import { ProductCategory } from "src/common/enums/product-caregory.enum";

export interface IProduct {
  id?: string;
  userId: string; // Unique user ID
  productName: string; // Name of the product
  price: number; // Price of the product
  quantity: number; // Available quantity
  company: string; // Company name
  dateOfManufacture: Date; // Date of manufacture
  description?: string; // Optional product description
  category: ProductCategory; // Enum for categories
}
