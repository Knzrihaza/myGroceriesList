import Link from 'next/link'
import type { FooterData } from '@/lib/types'

export function LandingFooter({
  data,
  appName,
  logoUrl,
}: {
  data: FooterData
  appName: string
  logoUrl?: string
}) {
  return (
    <footer
      className="border-t border-border/10 py-12"
      style={{ backgroundColor: 'var(--color-accent)', color: 'rgba(255,255,255,0.7)' }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            {logoUrl ? (
              <img src={logoUrl} alt={appName} className="h-8 object-contain mb-3 brightness-0 invert" />
            ) : (
              <span className="text-lg font-bold text-white">{appName}</span>
            )}
            {data.social_links.length > 0 && (
              <div className="flex gap-3 mt-4">
                {data.social_links.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:text-white transition-colors uppercase tracking-wider"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
          {/* Footer columns */}
          {data.columns.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.url} className="text-sm hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Required legal links — always present */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Legal</p>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-sm hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/delete-account" className="text-sm hover:text-white transition-colors">
                  Delete Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-xs text-center">
          {data.copyright}
        </div>
      </div>
    </footer>
  )
}
