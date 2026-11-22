import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Minimal Radix-style Slot: merges props/className onto its single child. */
export function Slot({ children, className, ...props }: { children?: ReactNode; className?: string; [key: string]: unknown }) {
  if (!isValidElement(children)) return null;
  const child = children as ReactElement<{ className?: string }>;
  return cloneElement(child, { ...props, className: cn(className, child.props.className) });
}
