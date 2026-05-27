"use client";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type CinematicSurfaceProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  grain?: boolean;
  intenseGrain?: boolean;
} & Omit<ComponentPropsWithoutRef<"section">, "children" | "className">;

const CinematicSurface = forwardRef<HTMLElement, CinematicSurfaceProps>(
  function CinematicSurface(
    {
      as,
      children,
      className,
      contentClassName,
      grain = true,
      intenseGrain = false,
      ...props
    },
    ref
  ) {
    const Tag = (as ?? "section") as ElementType;

    return (
      <Tag
        ref={ref}
        className={cn(
          "cinematic-surface cinematic-section relative overflow-hidden",
          intenseGrain && "cinematic-surface--intense-grain",
          className
        )}
        {...props}
      >
        {grain ? (
          <div
            className="cinematic-grain pointer-events-none absolute inset-0 z-0"
            aria-hidden
          />
        ) : null}
        <div className={cn("relative z-[1]", contentClassName)}>{children}</div>
      </Tag>
    );
  }
);

export default CinematicSurface;
