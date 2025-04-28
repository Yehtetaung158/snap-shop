// "use client";

import AnalyticCard from "@/components/analytics/analytic-card";
import { analytics, weeklyAnalytics } from "@/server/actions/analytics";
import React from "react";
import { Box, Clock, Package, Users } from "lucide-react";
import AnalyticChart from "@/components/analytics/analytic-chart";

const Analytic = async () => {
  const analyticsData = await analytics();
  const weeklyAnalyticsData = await weeklyAnalytics();
  console.log("weeklyAnalyticsData", weeklyAnalyticsData);
  return (
    <main>
      {analyticsData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <AnalyticCard
            title="Pending Orders"
            count={analyticsData.pendingOrder}
            icon={<Clock size={26} />}
            href="/dashboard/orders"
          />
          <AnalyticCard
            title="Completed Orders"
            count={analyticsData.completedOrder}
            icon={<Package size={26} />}
            href="/dashboard/orders"
          />
          <AnalyticCard
            title="Total Customers"
            count={analyticsData.totalUser}
            icon={<Users size={26} />}
            href="/"
          />
          <AnalyticCard
            title="Total Products"
            count={analyticsData.productCount}
            icon={<Box size={26} />}
            href="/dashboard/products"
          />
        </div>
      )}
      <AnalyticChart data={weeklyAnalyticsData!} />
    </main>
  );
};

export default Analytic;
