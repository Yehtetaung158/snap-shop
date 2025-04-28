// "use client";
import React, { useEffect } from "react";
import NavLogo from "./NavLogo";
import UserButton from "./UserButton";
import CartBtn from "../cart/cart-btn";
import { auth } from "@/server/auth";

const AppNav = async () => {
  const session = await auth();
  return (
    <div className="flex items-center justify-between w-full ">
      <NavLogo />
      <div className="flex items-center gap-4 cursor-pointer">
        <CartBtn />
        <UserButton user={session?.user} expires={session?.expires!} />
      </div>
    </div>
  );
};

export default AppNav;
