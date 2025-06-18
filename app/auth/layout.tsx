import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <main className=" mt-8 max-w-xl mx-auto">{children}</main>;
};

export default layout;
