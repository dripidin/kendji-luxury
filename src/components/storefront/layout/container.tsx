import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

/**
 * Global Storefront Container
 * Enforces max-width and consistent responsive horizontal padding.
 * Desktop: px-12 or px-20, Mobile: px-6
 */
export function Container({ children, className, as: Component = 'div', ...props }: ContainerProps) {
  return (
    <Component className={cn("mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-12 lg:px-20", className)} {...props}>
      {children}
    </Component>
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  fullBleed?: boolean;
}

/**
 * Global Storefront Section
 * Wrapper for vertical rhythm and structured blocks.
 */
export function Section({ children, className, fullBleed = false, ...props }: SectionProps) {
  return (
    <section className={cn("py-12 sm:py-16 md:py-24 lg:py-32", className)} {...props}>
      {fullBleed ? children : <Container>{children}</Container>}
    </section>
  );
}
