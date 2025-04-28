"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import CartItems from "./cart-items";
import { useCartStore } from "@/store/cart-store";
import CartStatus from "./cart-status";
import Payment from "./payment";
import Success from "./success";

type CartDrawerProps = {
  children: React.ReactNode;
};
const CartDrawer = ({ children }: CartDrawerProps) => {
  const cartPosition = useCartStore((state) => state.cartPosition);
  return (
    <>
      <Drawer>
        <DrawerTrigger>{children}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">Your Cart</DrawerTitle>
            <DrawerDescription className="text-center mb-10">
              thank for shopping with iCore.
            </DrawerDescription>
            <CartStatus />
          </DrawerHeader>
          {cartPosition === "Order" && <CartItems />}
          {cartPosition === "Checkout" && <Payment />}
          {cartPosition === "Success" && <Success />}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CartDrawer;
