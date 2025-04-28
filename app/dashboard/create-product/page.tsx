import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import React from "react";
import CreateProductForm from "./create-product";

const Page = async () => {
  const session = await auth();
  if(session?.user.role !== "admin") return redirect("/dashboard/settings");
  return <div>
    <CreateProductForm />
  </div>;
};

export default Page;
