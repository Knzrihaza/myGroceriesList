import Link from 'next/link'
import type { HeroData } from '@/lib/types'

export function LandingHero({ data }: { data: HeroData }) {
  const bgStyle =
    data.bg_style === 'gradient'
      ? { background: 'linear-gradient(135deg, var(--color-accent) 0%, color-mix(in oklch, var(--color-accent) 80%, var(--color-primary)) 100%)' }
      : data.bg_style === 'image' && data.image_url
      ? { backgroundImage: `url(${data.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundColor: 'var(--color-accent)' }

  return (
    <section className="relative overflow-hidden py-24 md:py-32" style={bgStyle}>
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            {data.headline}
          </h1>
          <p className="text-lg text-white/70 mb-8">{data.subheadline}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={data.cta_url}
              className="rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {data.cta_text}
            </Link>
            {data.secondary_cta_text && (
              <Link
                href={data.secondary_cta_url ?? '#'}
                className="rounded-lg border border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                {data.secondary_cta_text}
              </Link>
            )}
          </div>
        </div>
        {data.image_url && data.bg_style !== 'image' && (
          <div className="flex justify-center">
            <img
              src={data.image_url}
              alt="App preview"
              className="rounded-2xl shadow-2xl max-h-96 object-contain"
            />
          </div>
        )}
      </div>
    </section>
  )
}
