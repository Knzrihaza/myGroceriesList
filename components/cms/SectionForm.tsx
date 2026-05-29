"use client"

import * as React from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/cms/ImageUpload"
import type {
  LandingConfig, SectionKey, NavbarData, HeroData,
  FeatureItem, StatItem, ScreenshotItem, StepItem,
  AppStoreData, CtaData, FooterData
} from "@/lib/types"
import type { ActiveSection } from "@/hooks/use-landing-config"

type UpdateFn = <K extends keyof LandingConfig>(key: K, value: LandingConfig[K]) => void

interface SectionFormProps {
  config: LandingConfig
  activeSection: ActiveSection
  update: UpdateFn
}

// ── Branding ──────────────────────────────────────────────────────────────────
function BrandingForm({ config, update }: { config: LandingConfig; update: UpdateFn }) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-base">Colors & Branding</h3>
      <ImageUpload
        label="Logo"
        value={config.logo_url}
        onChange={(url) => update('logo_url', url)}
        storagePath={`${config.app_id}/logo`}
      />
      <ImageUpload
        label="Favicon"
        value={config.favicon_url}
        onChange={(url) => update('favicon_url', url)}
        storagePath={`${config.app_id}/favicon`}
      />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="primary_color">Primary Color</Label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            id="primary_color"
            value={config.primary_color}
            onChange={(e) => update('primary_color', e.target.value)}
            className="w-10 h-9 rounded-md border border-input cursor-pointer p-0.5"
          />
          <Input
            value={config.primary_color}
            onChange={(e) => update('primary_color', e.target.value)}
            className="font-mono"
            maxLength={7}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="accent_color">Accent / Dark Color</Label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            id="accent_color"
            value={config.accent_color}
            onChange={(e) => update('accent_color', e.target.value)}
            className="w-10 h-9 rounded-md border border-input cursor-pointer p-0.5"
          />
          <Input
            value={config.accent_color}
            onChange={(e) => update('accent_color', e.target.value)}
            className="font-mono"
            maxLength={7}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="font">Font</Label>
        <Select value={config.font} onValueChange={(v) => update('font', v as LandingConfig['font'])}>
          <SelectTrigger id="font" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="geist">Geist</SelectItem>
              <SelectItem value="poppins">Poppins</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function NavbarForm({ config, update }: { config: LandingConfig; update: UpdateFn }) {
  const navbar = config.navbar
  function updateNavbar(partial: Partial<NavbarData>) {
    update('navbar', { ...navbar, ...partial })
  }
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-base">Navigation</h3>
      <div className="flex flex-col gap-1.5">
        <Label>CTA Button Text</Label>
        <Input value={navbar.cta_text} onChange={(e) => updateNavbar({ cta_text: e.target.value })} placeholder="Get Started" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>CTA Button URL</Label>
        <Input value={navbar.cta_url} onChange={(e) => updateNavbar({ cta_url: e.target.value })} placeholder="#" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Nav Links</Label>
        {navbar.links.map((link, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={link.label}
              onChange={(e) => {
                const links = [...navbar.links]
                links[i] = { ...links[i], label: e.target.value }
                updateNavbar({ links })
              }}
              placeholder="Label"
            />
            <Input
              value={link.url}
              onChange={(e) => {
                const links = [...navbar.links]
                links[i] = { ...links[i], url: e.target.value }
                updateNavbar({ links })
              }}
              placeholder="URL"
            />
            <Button size="icon" variant="ghost" onClick={() => {
              updateNavbar({ links: navbar.links.filter((_, j) => j !== i) })
            }}>
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateNavbar({ links: [...navbar.links, { label: '', url: '#' }] })}
        >
          <PlusIcon className="size-4" /> Add Link
        </Button>
      </div>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroForm({ config, update }: { config: LandingConfig; update: UpdateFn }) {
  const hero = config.hero
  function updateHero(partial: Partial<HeroData>) {
    update('hero', { ...hero, ...partial })
  }
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-base">Hero Section</h3>
      <div className="flex flex-col gap-1.5">
        <Label>Headline</Label>
        <Input value={hero.headline} onChange={(e) => updateHero({ headline: e.target.value })} placeholder="Your App Name" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Sub-headline</Label>
        <Textarea value={hero.subheadline} onChange={(e) => updateHero({ subheadline: e.target.value })} rows={2} placeholder="A short description…" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>CTA Text</Label>
          <Input value={hero.cta_text} onChange={(e) => updateHero({ cta_text: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>CTA URL</Label>
          <Input value={hero.cta_url} onChange={(e) => updateHero({ cta_url: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Secondary CTA Text</Label>
          <Input value={hero.secondary_cta_text ?? ''} onChange={(e) => updateHero({ secondary_cta_text: e.target.value })} placeholder="Optional" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Secondary CTA URL</Label>
          <Input value={hero.secondary_cta_url ?? ''} onChange={(e) => updateHero({ secondary_cta_url: e.target.value })} placeholder="#" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Background Style</Label>
        <Select value={hero.bg_style} onValueChange={(v) => updateHero({ bg_style: v as HeroData['bg_style'] })}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="solid">Solid Color</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ImageUpload
        label="Hero Image"
        value={hero.image_url}
        onChange={(url) => updateHero({ image_url: url })}
        storagePath={`${config.app_id}/hero`}
      />
    </div>
  )
}

// ── Trust Badges ──────────────────────────────────────────────────────────────
function TrustBadgesForm({ config, update }: { config: LandingConfig; update: UpdateFn }) {
  const items = config.trust_badges
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-base">Trust Badges</h3>
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border p-3 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground">Badge {i + 1}</span>
            <Button size="icon" variant="ghost" onClick={() => update('trust_badges', items.filter((_, j) => j !== i))}>
              <Trash2Icon className="size-3" />
            </Button>
          </div>
          <ImageUpload
            label="Logo Image"
            value={item.image_url}
            onChange={(url) => {
              const next = [...items]
              next[i] = { ...next[i], image_url: url }
              update('trust_badges', next)
            }}
            storagePath={`${config.app_id}/badges/badge-${i}`}
          />
          <div className="flex flex-col gap-1.5">
            <Label>Alt Text</Label>
            <Input
              value={item.alt}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], alt: e.target.value }
                update('trust_badges', next)
              }}
              placeholder="Company name"
            />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => update('trust_badges', [...items, { image_url: '', alt: '' }])}>
        <PlusIcon className="size-4" /> Add Badge
      </Button>
    </div>
  )
}

// ── Features ──────────────────────────────────────────────────────────────────
function FeaturesForm({ config, update }: { config: LandingConfig; update: UpdateFn }) {
  const items = config.features
  function updateItem(i: number, partial: Partial<FeatureItem>) {
    const next = [...items]
    next[i] = { ...next[i], ...partial }
    update('features', next)
  }
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-base">Features</h3>
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border p-3 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground">Feature {i + 1}</span>
            <Button size="icon" variant="ghost" onClick={() => update('features', items.filter((_, j) => j !== i))}>
              <Trash2Icon className="size-3" />
            </Button>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Lucide Icon Name</Label>
            <Input value={item.icon} onChange={(e) => updateItem(i, { icon: e.target.value })} placeholder="ShieldCheck" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Title</Label>
            <Input value={item.title} onChange={(e) => updateItem(i, { title: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <Textarea value={item.description} onChange={(e) => updateItem(i, { description: e.target.value })} rows={2} />
          </div>
        </div>
      ))}
      {items.length < 6 && (
        <Button variant="outline" size="sm" onClick={() => update('features', [...items, { icon: 'Star', title: '', description: '' }])}>
          <PlusIcon className="size-4" /> Add Feature
        </Button>
      )}
    </div>
  )
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function StatsForm({ config, update }: { config: LandingConfig; update: UpdateFn }) {
  const items = config.stats
  function updateItem(i: number, partial: Partial<StatItem>) {
    const next = [...items]
    next[i] = { ...next[i], ...partial }
    update('stats', next)
  }
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-base">Stats</h3>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input value={item.value} onChange={(e) => updateItem(i, { value: e.target.value })} placeholder="3k+" className="w-24" />
          <Input value={item.label} onChange={(e) => updateItem(i, { label: e.target.value })} placeholder="Active users" />
          <Button size="icon" variant="ghost" onClick={() => update('stats', items.filter((_, j) => j !== i))}>
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      ))}
      {items.length < 4 && (
        <Button variant="outline" size="sm" onClick={() => update('stats', [...items, { value: '', label: '' }])}>
          <PlusIcon className="size-4" /> Add Stat
        </Button>
      )}
    </div>
  )
}

// ── Screenshots ───────────────────────────────────────────────────────────────
function ScreenshotsForm({ config, update }: { config: LandingConfig; update: UpdateFn }) {
  const items = config.screenshots
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-base">Screenshots</h3>
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border p-3 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground">Screenshot {i + 1}</span>
            <Button size="icon" variant="ghost" onClick={() => update('screenshots', items.filter((_, j) => j !== i))}>
              <Trash2Icon className="size-3" />
            </Button>
          </div>
          <ImageUpload
            value={item.url}
            onChange={(url) => {
              const next = [...items]
              next[i] = { ...next[i], url }
              update('screenshots', next)
            }}
            storagePath={`${config.app_id}/screenshots/screenshot-${i}`}
          />
          <div className="flex flex-col gap-1.5">
            <Label>Caption (optional)</Label>
            <Input
              value={item.caption ?? ''}
              onChange={(e) => {
                const next = [...items]
                next[i] = { ...next[i], caption: e.target.value }
                update('screenshots', next)
              }}
              placeholder="Caption"
            />
          </div>
        </div>
      ))}
      {items.length < 8 && (
        <Button variant="outline" size="sm" onClick={() => update('screenshots', [...items, { url: '' }])}>
          <PlusIcon className="size-4" /> Add Screenshot
        </Button>
      )}
    </div>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────────
function StepsForm({ config, update }: { config: LandingConfig; update: UpdateFn }) {
  const items = config.steps
  function updateItem(i: number, partial: Partial<StepItem>) {
    const next = [...items]
    next[i] = { ...next[i], ...partial }
    update('steps', next)
  }
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-base">How it Works</h3>
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border p-3 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
            <Button size="icon" variant="ghost" onClick={() => update('steps', items.filter((_, j) => j !== i))}>
              <Trash2Icon className="size-3" />
            </Button>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Title</Label>
            <Input value={item.title} onChange={(e) => updateItem(i, { title: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <Textarea value={item.description} onChange={(e) => updateItem(i, { description: e.target.value })} rows={2} />
          </div>
        </div>
      ))}
      {items.length < 5 && (
        <Button variant="outline" size="sm" onClick={() => update('steps', [...items, { title: '', description: '' }])}>
          <PlusIcon className="size-4" /> Add Step
        </Button>
      )}
    </div>
  )
}

// ── App Store ─────────────────────────────────────────────────────────────────
function AppStoreForm({ config, update }: { config: LandingConfig; update: UpdateFn }) {
  const data = config.app_store
  function updateData(partial: Partial<AppStoreData>) {
    update('app_store', { ...data, ...partial })
  }
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-base">App Store Badges</h3>
      <div className="flex flex-col gap-1.5">
        <Label>Section Label</Label>
        <Input value={data.label} onChange={(e) => updateData({ label: e.target.value })} placeholder="Download now" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Apple App Store URL</Label>
        <Input value={data.apple_url ?? ''} onChange={(e) => updateData({ apple_url: e.target.value })} placeholder="https://apps.apple.com/…" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Google Play URL</Label>
        <Input value={data.google_url ?? ''} onChange={(e) => updateData({ google_url: e.target.value })} placeholder="https://play.google.com/…" />
      </div>
    </div>
  )
}

// ── CTA Band ──────────────────────────────────────────────────────────────────
function CtaForm({ config, update }: { config: LandingConfig; update: UpdateFn }) {
  const data = config.cta
  function updateData(partial: Partial<CtaData>) {
    update('cta', { ...data, ...partial })
  }
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-base">CTA Band</h3>
      <div className="flex flex-col gap-1.5">
        <Label>Headline</Label>
        <Input value={data.headline} onChange={(e) => updateData({ headline: e.target.value })} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Sub-text</Label>
        <Input value={data.subtext ?? ''} onChange={(e) => updateData({ subtext: e.target.value })} placeholder="Optional" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Primary CTA Text</Label>
          <Input value={data.primary_text} onChange={(e) => updateData({ primary_text: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Primary CTA URL</Label>
          <Input value={data.primary_url} onChange={(e) => updateData({ primary_url: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>Secondary CTA Text</Label>
          <Input value={data.secondary_text ?? ''} onChange={(e) => updateData({ secondary_text: e.target.value })} placeholder="Optional" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Secondary CTA URL</Label>
          <Input value={data.secondary_url ?? ''} onChange={(e) => updateData({ secondary_url: e.target.value })} placeholder="#" />
        </div>
      </div>
    </div>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function FooterForm({ config, update }: { config: LandingConfig; update: UpdateFn }) {
  const data = config.footer
  function updateData(partial: Partial<FooterData>) {
    update('footer', { ...data, ...partial })
  }
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold text-base">Footer</h3>
      <p className="text-xs text-muted-foreground">Privacy Policy and Delete Account links are always included automatically.</p>
      <div className="flex flex-col gap-1.5">
        <Label>Copyright Text</Label>
        <Input value={data.copyright} onChange={(e) => updateData({ copyright: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Social Links</Label>
        {data.social_links.map((link, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={link.platform}
              onChange={(e) => {
                const sl = [...data.social_links]
                sl[i] = { ...sl[i], platform: e.target.value }
                updateData({ social_links: sl })
              }}
              placeholder="Twitter"
              className="w-28"
            />
            <Input
              value={link.url}
              onChange={(e) => {
                const sl = [...data.social_links]
                sl[i] = { ...sl[i], url: e.target.value }
                updateData({ social_links: sl })
              }}
              placeholder="https://…"
            />
            <Button size="icon" variant="ghost" onClick={() => updateData({ social_links: data.social_links.filter((_, j) => j !== i) })}>
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => updateData({ social_links: [...data.social_links, { platform: '', url: '' }] })}>
          <PlusIcon className="size-4" /> Add Social Link
        </Button>
      </div>
    </div>
  )
}

// ── Router ────────────────────────────────────────────────────────────────────
const FORMS: Record<ActiveSection, React.FC<{ config: LandingConfig; update: UpdateFn }>> = {
  branding:     BrandingForm,
  navbar:       NavbarForm,
  hero:         HeroForm,
  trust_badges: TrustBadgesForm,
  features:     FeaturesForm,
  stats:        StatsForm,
  screenshots:  ScreenshotsForm,
  steps:        StepsForm,
  app_store:    AppStoreForm,
  cta:          CtaForm,
  footer:       FooterForm,
}

export function SectionForm({ config, activeSection, update }: SectionFormProps) {
  const Form = FORMS[activeSection]
  return (
    <div className="flex-1 overflow-y-auto p-5">
      <Form config={config} update={update} />
    </div>
  )
}
