export interface IPurchaseProduct {
  purchaseId?: string;
  userId: string; // ID of the user making the purchase
  productId: string; // ID of the product being purchased
  quantity: number; // Quantity of the product being purchased
  totalPrice: number; // Total price for the purchase
  purchaseDate: Date; // Date of the purchase
}
