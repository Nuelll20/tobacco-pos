import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { DashboardDailySales } from "@/types/dashboard";

type DashboardSalesChartProps = {
  data: DashboardDailySales[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatChartDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(
    new Date(`${value}T00:00:00`)
  );
}

export default function DashboardSalesChart({
  data,
}: DashboardSalesChartProps) {
  const chartData = data.map((item) => ({
    date: item.date,
    dateLabel: formatChartDate(item.date),
    totalSales: Number(item.total_sales),
    transactionCount: item.transaction_count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Daily Sales
        </CardTitle>

        <CardDescription>
          Total sales recorded for each day in the selected period.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">
            No sales data available.
          </div>
        ) : (
          <div className="h-80 min-w-0">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={chartData}
                margin={{
                  top: 8,
                  right: 12,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="dateLabel"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) =>
                    formatCompactCurrency(
                      Number(value)
                    )
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(
                      Number(value)
                    ),
                    "Total Sales",
                  ]}
                  labelFormatter={(
                    label,
                    payload
                  ) => {
                    const item =
                      payload?.[0]?.payload;

                    return item?.date
                      ? `Date: ${item.date}`
                      : String(label);
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="totalSales"
                  name="Total Sales"
                  stroke="currentColor"
                  strokeWidth={2}
                  dot={{
                    r: 3,
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
