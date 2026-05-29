"use client"

import { useLandingConfig } from "@/hooks/use-landing-config"
import { SectionSidebar } from "@/components/cms/SectionSidebar"
import { SectionForm } from "@/components/cms/SectionForm"
import { LandingPreview } from "@/components/cms/LandingPreview"
import type { LandingConfig } from "@/lib/types"

export function LandingCmsEditor({ initial, appName }: { initial: LandingConfig; appName: string }) {
  const { config, update, save, isSaving, activeSection, setActiveSection, toggle } =
    useLandingConfig(initial)

  return (
    <div className="flex h-full w-full overflow-hidden">
      <SectionSidebar
        config={config}
        activeSection={activeSection}
        onSelect={setActiveSection}
        onToggle={toggle}
        onSave={save}
        isSaving={isSaving}
      />
      <SectionForm config={config} activeSection={activeSection} update={update} />
      <LandingPreview config={config} appName={appName} />
    </div>
  )
}
