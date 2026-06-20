import {
  CheckSquare,
  FileText,
  FolderKanban,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRelativeTime, getInitials } from "@/lib/format";
import type { ActivityItem } from "@/types/dashboard";

interface RecentActivityProps {
  activities: ActivityItem[];
}

const activityIcons = {
  task: CheckSquare,
  project: FolderKanban,
  member: UserPlus,
  note: FileText,
  comment: MessageSquare,
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activityIcons[activity.type];

            return (
              <div key={activity.id} className="flex gap-3">
                <div className="relative">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={activity.user.avatar}
                      alt={activity.user.name}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(activity.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full border border-background bg-muted">
                    <Icon className="size-2.5 text-muted-foreground" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user.name}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      — {activity.title.toLowerCase()}
                    </span>
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
