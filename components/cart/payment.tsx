import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useCartStore } from "@/store/cart-store";
import { stripeInit } from "@/lib/stripe-init";
import { totalPriceCalc } from "@/lib/total-price";
import PaymentForm from "./PaymentForm";

const stripe = stripeInit();

const Payment = () => {
  const cart = useCartStore((state) => state.cart);
  const totalPrice = totalPriceCalc(cart);
  const amountInCents = Math.round(totalPrice * 100); // Convert to cents

  if (amountInCents <= 0) {
    return (
      <div className="flex items-center justify-center flex-col p-4">
        <h1 className="text-2xl font-bold mb-4">Payment</h1>
        <p className="text-lg text-red-500">
          Your cart is empty. Please add items before proceeding to payment.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Elements
        stripe={stripe}
        options={{
          mode: "payment",
          currency: "usd",
          amount: amountInCents, // Use converted cents value
        }}
      >
        <div className="flex items-center justify-center flex-col">
          <h1 className="text-2xl font-bold mb-4">Payment</h1>
          <p className="text-lg font-medium mb-4">
            Total: ${totalPrice.toFixed(2)}
          </p>
        </div>
        <PaymentForm totalPrice={totalPrice} />
      </Elements>
    </div>
  );
};

export default Payment;