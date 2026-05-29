import Link from 'next/link'
import type { CtaData } from '@/lib/types'

export function LandingCta({ data }: { data: CtaData }) {
  return (
    <section className="py-24" style={{ backgroundColor: 'var(--color-accent)' }}>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{data.headline}</h2>
        {data.subtext && <p className="text-white/70 mb-8 text-lg">{data.subtext}</p>}
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={data.primary_url}
            className="rounded-lg px-8 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {data.primary_text}
          </Link>
          {data.secondary_text && (
            <Link
              href={data.secondary_url ?? '#'}
              className="rounded-lg border border-white/30 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              {data.secondary_text}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
