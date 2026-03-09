import { Badge } from "@/components/ui/badge"

interface StatusFilterProps {
  selectedStatus: string | null
  onSelectStatus: (status: string | null) => void
}

const statuses = [
  { id: "all", label: "All Matches", variant: "outline" as const },
  { id: "scheduled", label: "Scheduled", variant: "outline" as const },
  { id: "live", label: "Live", variant: "destructive" as const },
  { id: "finished", label: "Finished", variant: "default" as const },
  { id: "postponed", label: "Postponed", variant: "secondary" as const },
]

export function StatusFilter({ selectedStatus, onSelectStatus }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <Badge
          key={status.id}
          variant={selectedStatus === status.id || (selectedStatus === null && status.id === "all") ? status.variant : "outline"}
          className={`cursor-pointer transition-all ${
            selectedStatus === status.id || (selectedStatus === null && status.id === "all")
              ? "ring-2 ring-primary ring-offset-2"
              : "hover:bg-accent"
          }`}
          onClick={() => onSelectStatus(status.id === "all" ? null : status.id)}
        >
          {status.label}
        </Badge>
      ))}
    </div>
  )
}
