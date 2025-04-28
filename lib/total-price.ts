import { cartItem } from "@/store/cart-store";

export const totalPriceCalc = (CartItem: cartItem[]): number => {
  return CartItem.reduce((tot, item) => {
    const price = Number(item.price);
    const total = price * item.variants.quantity;
    return tot + total;
  }, 0);
};
