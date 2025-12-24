"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  ShoppingCart,
  Package,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ChartData = { name: string; value: number };

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Replace with API later
    setData({
      kpis: {
        revenue: 145800,
        orders: 684,
        users: 1240,
        lowStock: 6,
      },
      revenueChart: [
        { name: "Jan", value: 28000 },
        { name: "Feb", value: 36000 },
        { name: "Mar", value: 42000 },
        { name: "Apr", value: 39800 },
      ],
      orderChart: [
        { name: "Jan", value: 140 },
        { name: "Feb", value: 180 },
        { name: "Mar", value: 210 },
        { name: "Apr", value: 154 },
      ],
      categoryChart: [
        { name: "Cocopeat", value: 55 },
        { name: "Seedling Trays", value: 90 },
        { name: "Compost", value: 40 },
        { name: "Tools", value: 25 },
      ],
      recentOrders: [
        { id: "#ORD-201", customer: "Rahul", total: 2400, status: "Pending" },
        { id: "#ORD-202", customer: "Aman", total: 1800, status: "Shipped" },
        { id: "#ORD-203", customer: "Neha", total: 3200, status: "Delivered" },
      ],
    });
  }, []);

  if (!data) return null;

  return (
    <div
      className="p-6 space-y-8 bg-background text-foreground
 min-h-screen"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline">Last 30 Days</Button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPI
          title="Total Revenue"
          value={`₹${data.kpis.revenue}`}
          icon={IndianRupee}
        />
        <KPI title="Orders" value={data.kpis.orders} icon={ShoppingCart} />
        <KPI title="Customers" value={data.kpis.users} icon={Users} />
        <KPI
          title="Low Stock"
          value={data.kpis.lowStock}
          icon={AlertTriangle}
          danger
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Growth">
          <LineChartComponent data={data.revenueChart} color="#22c55e" />
        </ChartCard>

        <ChartCard title="Orders Trend">
          <LineChartComponent data={data.orderChart} color="#3b82f6" />
        </ChartCard>
      </div>

      {/* Category Chart */}
      <ChartCard title="Sales by Category">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.categoryChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Recent Orders */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {data.recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer}
                  </p>
                </div>
                <p className="font-semibold">₹{order.total}</p>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Components ---------- */

function KPI({ title, value, icon: Icon, danger }: any) {
  return (
    <Card className={danger ? "border-red-500" : ""}>
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <Icon
          className={`w-8 h-8 ${danger ? "text-red-500" : "text-indigo-500"}`}
        />
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}

function LineChartComponent({ data, color }: any) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function StatusBadge({ status }: any) {
  const map: any = {
    Pending: "secondary",
    Shipped: "default",
    Delivered: "success",
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}
