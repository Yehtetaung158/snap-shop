"use client";
import { Apple, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import React from "react";

const NavLogo = () => {
  return (
    <Link href="/" className="text-lg font-bold text-primary flex items-center gap-2">
      <Apple className="fill-primary" size={40}/>
      <span className=" text-3xl">iCore</span>
    </Link>
  );
};

export default NavLogo;
