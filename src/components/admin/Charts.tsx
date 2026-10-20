"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const C = { rose: "#a8693f", cocoa: "#2e3b32", blush: "#c9ba9f", green: "#3f7d5a", red: "#b5483b", grid: "#e9e2d4", muted: "#6f6a5c" };
const PIE = ["#a8693f", "#2e3b32", "#b3a081", "#4a5a4e", "#c9ba9f", "#8a5230", "#6f6a5c", "#c08a5e", "#3c4a40", "#ddd3c0", "#7d8b6a", "#1f2a22"];

const fmt = (cur: string) => (v: number) => `${cur}${Math.round(v).toLocaleString("en-US")}`;
const short = (cur: string) => (v: number) =>
  Math.abs(v) >= 1000 ? `${cur}${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `${cur}${v}`;

const tooltipStyle = { background: "#fdfbf7", border: "1px solid #e4dccd", borderRadius: 12, fontSize: 12 };

export function SalesAreaChart({ data, currency }: { data: { date: string; revenue: number; orders: number }[]; currency: string }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.rose} stopOpacity={0.35} />
            <stop offset="100%" stopColor={C.rose} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={C.grid} vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.muted }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
        <YAxis tickFormatter={short(currency)} tick={{ fontSize: 11, fill: C.muted }} tickLine={false} axisLine={false} width={56} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n) => (n === "revenue" ? [fmt(currency)(v), "Revenue"] : [v, "Orders"])} />
        <Area type="monotone" dataKey="revenue" stroke={C.rose} strokeWidth={2} fill="url(#rev)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PLChart({
  data,
  currency,
}: {
  data: { month: string; revenue: number; cogs: number; expenses: number; netProfit: number }[];
  currency: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid stroke={C.grid} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={short(currency)} tick={{ fontSize: 11, fill: C.muted }} tickLine={false} axisLine={false} width={56} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(currency)(v)} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="revenue" name="Revenue" fill={C.blush} radius={[6, 6, 0, 0]} />
        <Bar dataKey="cogs" name="Product Cost" fill={C.rose} radius={[6, 6, 0, 0]} />
        <Bar dataKey="expenses" name="Expenses" fill={C.cocoa} radius={[6, 6, 0, 0]} />
        <Line type="monotone" dataKey="netProfit" name="Net Profit" stroke={C.green} strokeWidth={2.5} dot={{ r: 3 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function ExpensePie({ data, currency }: { data: { label: string; total: number }[]; currency: string }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="label" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PIE[i % PIE.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmt(currency)(v)} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function OrdersBarChart({ data }: { data: { month: string; orders: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid stroke={C.grid} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.muted }} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: C.muted }} tickLine={false} axisLine={false} width={32} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="orders" name="Orders" fill={C.rose} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export const PIE_COLORS = PIE;
