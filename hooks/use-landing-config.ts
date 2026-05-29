"use client"

import * as React from "react"
import { toast } from "sonner"
import { saveLandingConfig, toggleSection } from "@/app/actions/landing"
import type { LandingConfig, SectionKey } from "@/lib/types"

export type ActiveSection =
  | 'branding'
  | 'navbar'
  | 'hero'
  | 'trust_badges'
  | 'features'
  | 'stats'
  | 'screenshots'
  | 'steps'
  | 'app_store'
  | 'cta'
  | 'footer'

export function useLandingConfig(initial: LandingConfig) {
  const [config, setConfig] = React.useState<LandingConfig>(initial)
  const [isSaving, setIsSaving] = React.useState(false)
  const [activeSection, setActiveSection] = React.useState<ActiveSection>('branding')

  React.useEffect(() => {
    setConfig(initial)
  }, [initial])

  function update<K extends keyof LandingConfig>(key: K, value: LandingConfig[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  async function save() {
    setIsSaving(true)
    try {
      const saved = await saveLandingConfig(config)
      setConfig(saved)
      toast.success('Changes saved')
    } catch {
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  async function toggle(section: SectionKey, enabled: boolean) {
    setConfig((prev) => ({ ...prev, [section]: enabled }))
    try {
      await toggleSection(section, enabled)
    } catch {
      setConfig((prev) => ({ ...prev, [section]: !enabled }))
      toast.error('Failed to update section')
    }
  }

  return { config, update, save, isSaving, activeSection, setActiveSection, toggle }
}
