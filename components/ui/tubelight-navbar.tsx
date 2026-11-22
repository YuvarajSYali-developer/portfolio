"use client";

/**
 * Tubelight Navbar — based on the 21st.dev component by Ayushmaan Singh (@ayushmxxn).
 * Floating pill with a shared-layout "tube light" that glides to the active item.
 * Controlled: the parent owns active-section tracking and navigation.
 */

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TubelightNavItem {
  name: string;
  id: string;
  icon?: LucideIcon;
}

interface TubelightNavbarProps {
  items: TubelightNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  className?: string;
  layoutId?: string;
}

export function TubelightNavbar({ items, activeId, onNavigate, className, layoutId = "tubelight" }: TubelightNavbarProps) {
  return (
    <ul className={cn("flex items-center gap-1 rounded-full p-1", className)}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        const Icon = item.icon;
        return (
          <li key={item.id} className="relative">
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id);
              }}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.8rem] font-medium tracking-wide transition-colors duration-300 lg:px-4",
                isActive ? "text-fg" : "text-fg-2 hover:text-fg",
              )}
            >
              {Icon ? <Icon className="size-4" strokeWidth={1.75} aria-hidden /> : null}
              <span>{item.name}</span>
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 -z-10 rounded-full bg-white/[0.06]"
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  aria-hidden
                >
                  {/* the tube light */}
                  <span className="absolute -top-[5px] left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-electric">
                    <span className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-electric/25 blur-md" />
                    <span className="absolute -top-1 h-6 w-8 rounded-full bg-cyan/20 blur-md" />
                    <span className="absolute left-2 top-0 h-4 w-4 rounded-full bg-electric/30 blur-sm" />
                  </span>
                </motion.span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
