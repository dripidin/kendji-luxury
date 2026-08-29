import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/storefront/layout/container";

export default function StorefrontNotFound() {
  return (
    <Section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-serif text-6xl md:text-8xl tracking-tight mb-6">404</h1>
      <h2 className="text-xl md:text-2xl mb-8 text-charcoal/70 uppercase tracking-widest">Page Not Found</h2>
      <p className="max-w-md mb-10 text-charcoal/60">
        The page you are looking for has been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <Button variant="outline" size="lg" className="px-12">
          RETURN HOME
        </Button>
      </Link>
    </Section>
  );
}
