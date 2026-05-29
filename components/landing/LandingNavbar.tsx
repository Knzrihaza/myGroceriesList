import Link from 'next/link'
import type { NavbarData } from '@/lib/types'

export function LandingNavbar({
  data,
  logoUrl,
  appName,
}: {
  data: NavbarData
  logoUrl?: string
  appName: string
}) {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-sm"
      style={{ backgroundColor: 'var(--color-accent)' }}
    >
      <div className="mx-auto max-w-6xl px-6 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt={appName} className="h-8 w-auto object-contain" />
          ) : (
            <span className="text-lg font-bold text-white">{appName}</span>
          )}
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {data.links.map((link) => (
            <Link
              key={link.label}
              href={link.url}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        {data.cta_text && (
          <Link
            href={data.cta_url}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {data.cta_text}
          </Link>
        )}
      </div>
    </nav>
  )
}
