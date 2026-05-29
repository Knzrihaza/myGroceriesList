import type { StatItem } from '@/lib/types'

export function LandingStats({
  title,
  subtitle,
  items,
}: {
  title?: string
  subtitle?: string
  items: StatItem[]
}) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold mb-3">{title}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="text-4xl font-bold mb-1"
                style={{ color: 'var(--color-primary)' }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
