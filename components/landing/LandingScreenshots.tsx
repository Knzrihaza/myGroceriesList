import type { ScreenshotItem } from '@/lib/types'

export function LandingScreenshots({
  title,
  items,
  displayStyle = 'grid',
}: {
  title?: string
  items: ScreenshotItem[]
  displayStyle?: 'grid' | 'carousel' | 'scrolling'
}) {
  const isScroll = displayStyle === 'carousel' || displayStyle === 'scrolling'
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        )}
        <div
          className={
            isScroll
              ? 'flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-none'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          }
        >
          {items.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden border border-border shadow-sm ${isScroll ? 'flex-none w-72 snap-start' : ''}`}
            >
              <img
                src={item.url}
                alt={item.caption ?? `Screenshot ${i + 1}`}
                className="w-full object-cover"
              />
              {item.caption && (
                <p className="px-4 py-2 text-xs text-muted-foreground">{item.caption}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
