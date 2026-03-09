import Image from "next/image"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoteButtonProps {
  active: boolean
  disabled: boolean
  colorClass: string
  label: string
  percent: number
  logo?: string
  onClick: () => void
}

export function VoteButton({
  active,
  disabled,
  colorClass,
  label,
  percent,
  logo,
  onClick,
}: VoteButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center p-3 rounded-xl border-2 transition-all",
        active ? colorClass : "border-border bg-card hover:border-muted"
      )}
    >
      {active && (
        <Check className="absolute top-2 right-2 w-4 h-4 text-current" />
      )}

      {logo && (
        <div className="relative w-10 h-10 mb-1">
          <Image src={logo} alt={label} fill className="object-contain" />
        </div>
      )}

      <span className="text-sm font-medium">{label}</span>
      <span className="text-xl font-bold">{percent}%</span>
    </button>
  )
}
