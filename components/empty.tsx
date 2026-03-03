import type { LucideIcon } from "lucide-react";
import { Card, CardContent, Button } from "./ui";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, icon: Icon, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="ring-1 ring-black/5 bg-gradient-to-b from-white to-cyanSoft-50/30">
      <CardContent className="grid gap-3 p-6">
        {Icon ? (
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-black/10 text-cyanSoft-500">
            <Icon size={18} />
          </div>
        ) : null}
        <div className="text-sm font-extrabold">{title}</div>
        <p className="text-sm text-black/60">{description}</p>
        {actionLabel && onAction ? (
          <div className="pt-1">
            <Button onClick={onAction} variant="outline">{actionLabel}</Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
