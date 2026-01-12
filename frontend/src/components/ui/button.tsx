import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "accent"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          "cursor-pointer",
          {
            // Default: Teal gradient button
            "bg-gradient-to-r from-[#00efa6] to-[#069268] text-black font-semibold hover:opacity-90 shadow-lg hover:shadow-[0_0_20px_rgba(0,239,166,0.4)]":
              variant === "default",
            // Outline: Glass effect with border
            "border border-[hsl(var(--border))] bg-transparent backdrop-blur-sm hover:bg-white/5 hover:border-[var(--accent)] text-foreground":
              variant === "outline",
            // Ghost: Subtle hover
            "hover:bg-white/10 text-foreground": variant === "ghost",
            // Destructive: Red themed
            "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
            // Accent: Solid accent color
            "bg-[var(--accent)] text-black font-semibold hover:opacity-90":
              variant === "accent",
          },
          {
            "h-10 px-6 py-2": size === "default",
            "h-8 px-3 text-sm": size === "sm",
            "h-12 px-8 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
