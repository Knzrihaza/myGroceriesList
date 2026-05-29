import { getLandingConfig, DEFAULT_LANDING_CONFIG, getApp } from '@/lib/db'
import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingTrustBadges } from '@/components/landing/LandingTrustBadges'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingStats } from '@/components/landing/LandingStats'
import { LandingScreenshots } from '@/components/landing/LandingScreenshots'
import { LandingSteps } from '@/components/landing/LandingSteps'
import { LandingAppStore } from '@/components/landing/LandingAppStore'
import { LandingCta } from '@/components/landing/LandingCta'
import { LandingFooter } from '@/components/landing/LandingFooter'
import type { LandingConfig } from '@/lib/types'

export default async function HomePage() {
  const [app, rawConfig] = await Promise.all([getApp(), getLandingConfig()])
  const config: LandingConfig = rawConfig ?? {
    ...DEFAULT_LANDING_CONFIG,
    id: 'default',
    app_id: app.id,
  }

  const cssVars = {
    '--color-primary': config.primary_color,
    '--color-accent': config.accent_color,
  } as React.CSSProperties

  return (
    <main style={cssVars}>
      {config.navbar_enabled && (
        <LandingNavbar data={config.navbar} logoUrl={config.logo_url} appName={app.name} />
      )}
      {config.hero_enabled && <LandingHero data={config.hero} />}
      {config.trust_badges_enabled && (
        <LandingTrustBadges badges={config.trust_badges} />
      )}
      {config.features_enabled && (
        <LandingFeatures items={config.features} />
      )}
      {config.stats_enabled && (
        <LandingStats items={config.stats} />
      )}
      {config.screenshots_enabled && (
        <LandingScreenshots items={config.screenshots} />
      )}
      {config.steps_enabled && (
        <LandingSteps items={config.steps} />
      )}
      {config.app_store_enabled && (
        <LandingAppStore data={config.app_store} />
      )}
      {config.cta_enabled && <LandingCta data={config.cta} />}
      <LandingFooter data={config.footer} appName={app.name} logoUrl={config.logo_url} />
    </main>
  )
}
