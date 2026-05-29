import type { TrustBadgeItem } from '@/lib/types'

export function LandingTrustBadges({
  label,
  badges,
}: {
  label?: string
  badges: TrustBadgeItem[]
}) {
  if (badges.length === 0) return null
  return (
    <section className="border-y border-border py-8">
      <div className="mx-auto max-w-6xl px-6">
        {label && (
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            {label}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {badges.map((badge, i) => (
            <img
              key={i}
              src={badge.image_url}
              alt={badge.alt}
              className="h-7 object-contain grayscale opacity-60 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
