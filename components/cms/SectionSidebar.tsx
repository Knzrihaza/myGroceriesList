"use client"

import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  SaveIcon, PaletteIcon, NavigationIcon, LayoutTemplateIcon,
  AwardIcon, SparklesIcon, BarChart2Icon, ImageIcon,
  ListOrderedIcon, SmartphoneIcon, MegaphoneIcon, AlignJustifyIcon
} from "lucide-react"
import type { LandingConfig, SectionKey } from "@/lib/types"
import type { ActiveSection } from "@/hooks/use-landing-config"

const GLOBAL_SECTIONS: { id: ActiveSection; label: string; icon: React.ReactNode }[] = [
  { id: 'branding', label: 'Colors & Branding', icon: <PaletteIcon className="size-4" /> },
  { id: 'navbar',   label: 'Navigation',         icon: <NavigationIcon className="size-4" /> },
]

const TOGGLE_SECTIONS: {
  id: ActiveSection
  label: string
  icon: React.ReactNode
  toggleKey: SectionKey | null
}[] = [
  { id: 'hero',         label: 'Hero',          icon: <LayoutTemplateIcon className="size-4" />, toggleKey: 'hero_enabled' },
  { id: 'trust_badges', label: 'Trust Badges',  icon: <AwardIcon className="size-4" />,          toggleKey: 'trust_badges_enabled' },
  { id: 'features',     label: 'Features',      icon: <SparklesIcon className="size-4" />,        toggleKey: 'features_enabled' },
  { id: 'stats',        label: 'Stats',          icon: <BarChart2Icon className="size-4" />,      toggleKey: 'stats_enabled' },
  { id: 'screenshots',  label: 'Screenshots',   icon: <ImageIcon className="size-4" />,           toggleKey: 'screenshots_enabled' },
  { id: 'steps',        label: 'How it Works',  icon: <ListOrderedIcon className="size-4" />,     toggleKey: 'steps_enabled' },
  { id: 'app_store',    label: 'App Store',      icon: <SmartphoneIcon className="size-4" />,     toggleKey: 'app_store_enabled' },
  { id: 'cta',          label: 'CTA Band',      icon: <MegaphoneIcon className="size-4" />,       toggleKey: 'cta_enabled' },
  { id: 'footer',       label: 'Footer',        icon: <AlignJustifyIcon className="size-4" />,    toggleKey: null },
]

interface SectionSidebarProps {
  config: LandingConfig
  activeSection: ActiveSection
  onSelect: (section: ActiveSection) => void
  onToggle: (key: SectionKey, enabled: boolean) => void
  onSave: () => void
  isSaving: boolean
}

export function SectionSidebar({
  config,
  activeSection,
  onSelect,
  onToggle,
  onSave,
  isSaving,
}: SectionSidebarProps) {
  return (
    <div className="flex flex-col h-full w-52 border-r border-border bg-background shrink-0">
      <div className="px-3 py-3 border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Landing Sections</p>
      </div>

      <div className="flex flex-col overflow-y-auto flex-1">
        {/* Global */}
        <div className="px-3 pt-3 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Global</p>
        </div>
        {GLOBAL_SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors hover:bg-muted",
              activeSection === s.id && "bg-muted font-medium text-foreground"
            )}
          >
            {s.icon}
            {s.label}
          </button>
        ))}

        {/* Toggle sections */}
        <div className="px-3 pt-4 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Sections</p>
        </div>
        {TOGGLE_SECTIONS.map((s) => {
          const isEnabled = s.toggleKey ? (config[s.toggleKey] as boolean) : true
          const isActive = activeSection === s.id
          return (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm transition-colors",
                isActive && "bg-muted"
              )}
            >
              <button
                onClick={() => onSelect(s.id)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                {s.icon}
                <span className={cn(isActive ? "font-medium text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </span>
              </button>
              {s.toggleKey && (
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(v) => onToggle(s.toggleKey!, v)}
                  className="scale-75"
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="p-3 border-t border-border">
        <Button onClick={onSave} disabled={isSaving} className="w-full" size="sm">
          <SaveIcon className="size-4" />
          {isSaving ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
