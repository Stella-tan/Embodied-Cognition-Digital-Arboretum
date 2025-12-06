"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Info, 
  ExternalLink, 
  Dna, 
  Microscope, 
  BookOpen,
  Database,
  FileText,
  Globe
} from "lucide-react"
import { Trait, TraitReference } from "@/lib/traits-data"

interface TraitInfoDialogProps {
  trait: Trait
  categoryIcon?: string
  categoryName?: string
}

const referenceIcons: Record<TraitReference["type"], React.ReactNode> = {
  wikipedia: <Globe className="w-3.5 h-3.5" />,
  paper: <FileText className="w-3.5 h-3.5" />,
  database: <Database className="w-3.5 h-3.5" />,
  article: <BookOpen className="w-3.5 h-3.5" />,
}

const referenceLabels: Record<TraitReference["type"], string> = {
  wikipedia: "Wikipedia",
  paper: "Research Paper",
  database: "Database",
  article: "Article",
}

export function TraitInfoDialog({ trait, categoryIcon, categoryName }: TraitInfoDialogProps) {
  const [open, setOpen] = useState(false)

  const hasReferences = trait.references && trait.references.length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="p-1 rounded-full hover:bg-primary/20 transition-colors group"
          onClick={(e) => {
            e.stopPropagation()
          }}
          title="View trait details"
        >
          <Info className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {categoryIcon && <span className="text-2xl">{categoryIcon}</span>}
            <div>
              <DialogTitle className="text-xl font-bold">{trait.name}</DialogTitle>
              {categoryName && (
                <p className="text-sm text-muted-foreground">{categoryName}</p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Microscope className="w-4 h-4 text-primary" />
              Description
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {trait.description}
            </p>
          </div>

          {/* Gene & Source */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Dna className="w-4 h-4 text-chart-2" />
                Gene
              </h4>
              <Badge variant="outline" className="font-mono text-sm">
                {trait.gene}
              </Badge>
            </div>
            {trait.source && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-chart-4" />
                  Source Organism
                </h4>
                <p className="text-sm text-muted-foreground italic">
                  {trait.source}
                </p>
              </div>
            )}
          </div>

          {/* Mechanism */}
          {trait.mechanism && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Microscope className="w-4 h-4 text-chart-5" />
                Mechanism
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/50 p-3 rounded-lg">
                {trait.mechanism}
              </p>
            </div>
          )}

          {/* References */}
          {hasReferences ? (
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary" />
                References
              </h4>
              <div className="space-y-2">
                {trait.references!.map((ref, idx) => (
                  <a
                    key={idx}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {referenceIcons[ref.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {ref.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {referenceLabels[ref.type]}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-secondary/30 border border-dashed border-border text-center">
              <p className="text-sm text-muted-foreground">
                No references available for this trait yet.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}




