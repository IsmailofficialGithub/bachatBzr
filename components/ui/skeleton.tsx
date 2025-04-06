import { cn } from "@/lib/utils"
import "@/public/assets/css/tailwind-cdn.css"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={{background:"green"}}
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
