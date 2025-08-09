"use client"

import { cn } from "@/lib/utils"
import { Calendar, MapPin, Workflow } from "lucide-react"

type TimelineEvent = {
  id: string
  stepName: string
  location?: string
  occurredAt: string // ISO
  notes?: string
}

export default function ProductTimeline({ events = [] as TimelineEvent[] }) {
  if (events.length === 0) {
    return <div className="text-sm text-muted-foreground">{"Belum ada jejak proses untuk batch ini."}</div>
  }
  return (
    <ol className="relative ml-3 border-l pl-6">
      {events.map((e, idx) => {
        const isLast = idx === events.length - 1
        return (
          <li key={e.id} className={cn("mb-6", isLast && "mb-0")}>
            <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full border bg-white ring-2 ring-emerald-200">
              <Workflow className="h-3 w-3 text-emerald-600" />
            </span>
            <div className="flex flex-col gap-1">
              <div className="font-medium">{e.stepName}</div>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(e.occurredAt).toLocaleString()}
                </div>
                {e.location ? (
                  <div className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {e.location}
                  </div>
                ) : null}
              </div>
              {e.notes ? <div className="text-sm">{e.notes}</div> : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
