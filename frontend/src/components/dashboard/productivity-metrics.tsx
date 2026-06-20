import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductivityMetric } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface ProductivityMetricsProps {
  metrics: ProductivityMetric[];
}

export function ProductivityMetrics({ metrics }: ProductivityMetricsProps) {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Productivity metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => {
            const isPositive = metric.change >= 0;
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;

            return (
              <div
                key={metric.label}
                className="rounded-lg border border-border p-4"
              >
                <p className="text-xs text-muted-foreground">{metric.label}</p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-2xl font-semibold tabular-nums">
                    {metric.value}
                    {metric.label === "On-time delivery" && "%"}
                    {metric.label === "Avg. completion time" && "d"}
                  </p>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      isPositive ? "text-emerald-600" : "text-red-600"
                    )}
                  >
                    <TrendIcon className="size-3.5" />
                    {isPositive ? "+" : ""}
                    {metric.change}%
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {metric.period}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
