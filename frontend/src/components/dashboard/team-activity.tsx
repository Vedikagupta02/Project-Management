import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime, getInitials } from "@/lib/format";
import type { TeamActivityItem } from "@/types/dashboard";

interface TeamActivityProps {
  activities: TeamActivityItem[];
}

export function TeamActivity({ activities }: TeamActivityProps) {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Team activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <Avatar className="size-8">
                <AvatarImage
                  src={activity.user.avatar}
                  alt={activity.user.name}
                />
                <AvatarFallback className="text-xs">
                  {getInitials(activity.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    {activity.action} in{" "}
                  </span>
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {activity.user.role} ·{" "}
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
