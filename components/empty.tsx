import { Card, CardContent, LinkButton } from "./ui";

export function EmptyState({ title, desc, actionHref, actionLabel }: { title: string; desc: string; actionHref?: string; actionLabel?: string }) {
  return (
    <Card>
      <CardContent className="grid gap-2">
        <div className="text-sm font-extrabold">{title}</div>
        <p className="text-sm text-black/60">{desc}</p>
        {actionHref && actionLabel ? (
          <div className="pt-2">
            <LinkButton href={actionHref} variant="outline">{actionLabel}</LinkButton>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
