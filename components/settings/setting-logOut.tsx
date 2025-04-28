"use client";

import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const SettingLogOut = () => {
  return (
    <Card className=" flex items-center justify-between px-2 py-4 w-full">
      <p>Just one click to log out</p>
      <Button
        className=" cursor-pointer bg-red-500 text-red-50"
        onClick={() => signOut()}
      >
        <LogOut className="w-5 h-5 mr-3" />
        <span className=" text-sm font-medium">Log out</span>
      </Button>
    </Card>
  );
};

export default SettingLogOut;
