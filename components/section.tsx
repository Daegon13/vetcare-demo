import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, desc, className }: { eyebrow?: string; title: string; desc?: string; className?: string }) {
  return (
    <div className={cn("grid gap-2", className)}>
      {eyebrow ? <div className="text-xs font-semibold tracking-wide text-cyanSoft-500">{eyebrow.toUpperCase()}</div> : null}
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h1>
      {desc ? <p className="text-sm sm:text-base text-black/60 max-w-2xl">{desc}</p> : null}
    </div>
  );
}
