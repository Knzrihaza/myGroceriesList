import { SmartphoneIcon } from 'lucide-react'
import type { AppStoreData } from '@/lib/types'

export function LandingAppStore({ data }: { data: AppStoreData }) {
  const hasBadges = data.apple_url || data.google_url
  if (!hasBadges) return null
  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 text-center">
        {data.label && (
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            {data.label}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {data.apple_url && (
            <a
              href={data.apple_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border px-6 py-3 font-semibold transition-colors hover:bg-muted"
            >
              <SmartphoneIcon className="size-5" />
              App Store
            </a>
          )}
          {data.google_url && (
            <a
              href={data.google_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border px-6 py-3 font-semibold transition-colors hover:bg-muted"
            >
              <SmartphoneIcon className="size-5" />
              Google Play
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
