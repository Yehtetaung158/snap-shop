import React from "react";
import { Card, CardHeader } from "../ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  count: number;
  title: string;
  icon: React.ReactNode;
  href: string;
};
const AnalyticCard = ({ href, count, icon, title }: Props) => {
  const isPendingCard = title === "Pending Orders";
  return (
    <Link href={href}>
      <Card className={cn(isPendingCard && "bg-black text-white")}>
        <CardHeader>
          <div
            className="
        flex items-center justify-between"
          >
            {icon}
            <h2 className="text-2xl font-bold">{count}+</h2>
          </div>
          <p className="text-normal font-medium">{title}</p>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default AnalyticCard;
