import { BRAND } from "@/lib/data";
import { LinkButton } from "@/components/ui";

type CommercialImplementationCTAProps = {
  className?: string;
  variant?: "primary" | "outline" | "ghost";
};

export function CommercialImplementationCTA({ className, variant = "outline" }: CommercialImplementationCTAProps) {
  return (
    <LinkButton href={BRAND.implementationCtaUrl} variant={variant} className={className}>
      {BRAND.implementationCtaLabel}
    </LinkButton>
  );
}
