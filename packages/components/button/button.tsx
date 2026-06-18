import type { ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx } from "clsx"

const buttonVariants = cva(
  // base styles
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 hover:bg-gray-50",
        ghost: "hover:bg-gray-100",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}