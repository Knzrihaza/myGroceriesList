"use client"

import * as React from "react"
import { MonitorIcon, SmartphoneIcon, PanelRightCloseIcon, PanelRightOpenIcon, ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LandingNavbar } from "@/components/landing/LandingNavbar"
import { LandingHero } from "@/components/landing/LandingHero"
import { LandingTrustBadges } from "@/components/landing/LandingTrustBadges"
import { LandingFeatures } from "@/components/landing/LandingFeatures"
import { LandingStats } from "@/components/landing/LandingStats"
import { LandingScreenshots } from "@/components/landing/LandingScreenshots"
import { LandingSteps } from "@/components/landing/LandingSteps"
import { LandingAppStore } from "@/components/landing/LandingAppStore"
import { LandingCta } from "@/components/landing/LandingCta"
import { LandingFooter } from "@/components/landing/LandingFooter"
import type { LandingConfig } from "@/lib/types"

const COLLAPSED_WIDTH = 0
const DEFAULT_WIDTH = 380
const MIN_WIDTH = 260
const MAX_WIDTH = 720
const MOBILE_WIDTH = 375

interface LandingPreviewProps {
  config: LandingConfig
  appName: string
}

export function LandingPreview({ config, appName }: LandingPreviewProps) {
  const [width, setWidth] = React.useState<number>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cms_preview_width')
      return stored ? Number(stored) : DEFAULT_WIDTH
    }
    return DEFAULT_WIDTH
  })
  const [isMobile, setIsMobile] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const dragging = React.useRef(false)
  const startX = React.useRef(0)
  const startWidth = React.useRef(0)
  const widthRef = React.useRef(width)

  function startDrag(e: React.MouseEvent) {
    dragging.current = true
    startX.current = e.clientX
    startWidth.current = width
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
  }

  function onDrag(e: MouseEvent) {
    if (!dragging.current) return
    const delta = startX.current - e.clientX
    const next = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth.current + delta))
    setWidth(next)
    widthRef.current = next
  }

  function stopDrag() {
    dragging.current = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
    localStorage.setItem('cms_preview_width', String(widthRef.current))
  }

  function collapse() {
    setIsCollapsed(true)
    localStorage.setItem('cms_preview_collapsed', '1')
  }

  function expand() {
    setIsCollapsed(false)
    localStorage.removeItem('cms_preview_collapsed')
  }

  const previewWidth = isMobile ? MOBILE_WIDTH : width
  const cssVars = {
    '--color-primary': config.primary_color,
    '--color-accent': config.accent_color,
  } as React.CSSProperties

  if (isCollapsed) {
    return (
      <div className="flex items-start pt-3 px-2">
        <Button size="icon" variant="ghost" onClick={expand} title="Show preview">
          <PanelRightOpenIcon className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex" style={{ width: previewWidth + 8 }}>
      {/* Drag handle */}
      <div
        className="w-2 cursor-col-resize flex items-center justify-center hover:bg-primary/20 transition-colors"
        onMouseDown={startDrag}
      >
        <div className="w-0.5 h-8 bg-border rounded-full" />
      </div>

      <div className="flex flex-col flex-1 bg-background border-l border-border overflow-hidden" style={{ width: previewWidth }}>
        {/* Preview header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30 shrink-0">
          <span className="text-xs font-medium text-muted-foreground">Preview</span>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant={isMobile ? "default" : "ghost"}
              className="size-6"
              onClick={() => setIsMobile(true)}
              title="Mobile"
            >
              <SmartphoneIcon className="size-3" />
            </Button>
            <Button
              size="icon"
              variant={!isMobile ? "default" : "ghost"}
              className="size-6"
              onClick={() => setIsMobile(false)}
              title="Desktop"
            >
              <MonitorIcon className="size-3" />
            </Button>
            <a href="/" target="_blank" rel="noopener" className="inline-flex">
              <Button size="icon" variant="ghost" className="size-6" title="Open live">
                <ExternalLinkIcon className="size-3" />
              </Button>
            </a>
            <Button size="icon" variant="ghost" className="size-6" onClick={collapse} title="Hide preview">
              <PanelRightCloseIcon className="size-3" />
            </Button>
          </div>
        </div>

        {/* Scaled preview */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div style={{ ...cssVars, minWidth: isMobile ? MOBILE_WIDTH : undefined }}>
            {config.navbar_enabled && (
              <LandingNavbar data={config.navbar} logoUrl={config.logo_url} appName={appName} />
            )}
            {config.hero_enabled && <LandingHero data={config.hero} />}
            {config.trust_badges_enabled && (
              <LandingTrustBadges badges={config.trust_badges} />
            )}
            {config.features_enabled && <LandingFeatures items={config.features} />}
            {config.stats_enabled && <LandingStats items={config.stats} />}
            {config.screenshots_enabled && <LandingScreenshots items={config.screenshots} />}
            {config.steps_enabled && <LandingSteps items={config.steps} />}
            {config.app_store_enabled && <LandingAppStore data={config.app_store} />}
            {config.cta_enabled && <LandingCta data={config.cta} />}
            <LandingFooter data={config.footer} appName={appName} logoUrl={config.logo_url} />
          </div>
        </div>
      </div>
    </div>
  )
}
