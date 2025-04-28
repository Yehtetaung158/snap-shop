"use client";
import React, { use, useEffect, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/cart-store";
import { useAction } from "next-safe-action/hooks";
import { createOrder } from "@/server/actions/order";
import { toast } from "sonner";
import { processPayment } from "@/server/actions/payment-action";

type PaymentFormProps = {
  totalPrice: number;
};
const PaymentForm = ({ totalPrice }: PaymentFormProps) => {
  console.log("totalPrice", totalPrice);
  const cartPosition = useCartStore((state) => state.cartPosition);
  console.log("cartPosition", cartPosition);
  const cart = useCartStore((state) => state.cart);
  const setCartPosition = useCartStore((state) => state.setCartPosition);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (cartPosition === "Success" && cart.length === 0) {
      setCartPosition("Order");
    }

    if (cartPosition !== "Checkout" && cart.length === 0) {
      setCartPosition("Order");
    }
  }, []);

  const { execute } = useAction(createOrder, {
    onSuccess: ({ data }) => {
      console.log("data", data);
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data.success);
        setCartPosition("Success");
      }
    },
  });

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setLoading(false);
      setErrorMsg(submitError.message || "Something went wrong");
      return;
    }

    const response = await processPayment({
      amount: totalPrice * 100,
      currency: "usd",
      cart: cart.map((ci) => ({
        quantity: ci.variants.quantity,
        productId: ci.id,
        title: ci.name,
        price: Number(ci.price),
        image: ci.image,
      })),
    });

    if (response?.data?.error) {
      setErrorMsg(response?.data?.error);
      setLoading(false);
      return;
    }

    if (response?.data?.success) {
      const paymentResponse = await stripe.confirmPayment({
        elements,
        clientSecret: response.data.success.clientSecretId!,
        redirect: "if_required",
        confirmParams: {
          // return_url: process.env.STRIPE_SUCCESS_URL!,
          return_url: `http://localhost:3000/cart/success`,
          receipt_email: response.data.success.user_email,
        },
      });

      if (paymentResponse.error) {
        setErrorMsg(paymentResponse.error.message!);
        setLoading(false);
        toast.error(paymentResponse.error.message!);
        return;
      } else {
        setLoading(false);
        toast.success("Payment successful!");
        // clearCart();
        execute({
          paymentId: response.data.success.paymentIntentId,
          totalPrice,
          status: "pending",
          products: cart.map((ci) => ({
            productId: ci.id,
            quantity: ci.variants.quantity,
            variantId: ci.variants.variantId,
          })),
        });
      }
    }
  };

  return (
    <main className="max-w-4xl mx-auto">
      <form onSubmit={onSubmitHandler}>
        <PaymentElement />
        <Button
          disabled={loading || !stripe || !elements}
          type="submit"
          className="w-full my-4"
        >
          Pay
        </Button>
      </form>
    </main>
  );
};

export default PaymentForm;
