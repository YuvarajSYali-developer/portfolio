import { Slot } from "./slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** shadcn/ui-style button, themed for the portfolio. */
const buttonVariants = cva(
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-fg text-ink hover:shadow-[0_0_0_1px_rgba(245,247,252,0.4),0_10px_40px_-10px_rgba(98,138,255,0.7)]",
        glass: "glass text-fg hover:border-line-strong hover:bg-white/[0.06]",
        outline: "border border-line-strong text-fg hover:border-fg-2 hover:bg-white/[0.03]",
        ghost: "text-fg-2 hover:text-fg",
      },
      size: {
        sm: "h-9 px-4 text-[0.8rem]",
        md: "h-11 px-5",
        lg: "h-14 px-7 text-[0.95rem]",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
