import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, Button } from "./ui";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  illustrationSrc?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  description,
  icon: Icon,
  illustrationSrc,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <Card className="ring-1 ring-black/5 bg-gradient-to-b from-white to-cyanSoft-50/30 dark:from-graphite-900 dark:to-graphite-900/50 dark:ring-white/10">
      <CardContent className="grid gap-3 p-6">
        {illustrationSrc ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/10 dark:ring-white/10">
            <Image
              src={illustrationSrc}
              alt="Ilustración del estado vacío"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        ) : null}
        {Icon ? (
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white ring-1 ring-black/10 text-cyanSoft-500 dark:bg-graphite-950 dark:ring-white/10">
            <Icon size={18} />
          </div>
        ) : null}
        <div className="text-sm font-extrabold">{title}</div>
        <p className="text-sm text-black/60 dark:text-white/70">{description}</p>
        {actionLabel && onAction ? (
          <div className="pt-1">
            <Button onClick={onAction} variant="outline">{actionLabel}</Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
