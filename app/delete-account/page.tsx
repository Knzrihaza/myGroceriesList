import Link from 'next/link'
import { CheckCircleIcon, Trash2Icon, MailIcon, ArrowLeftIcon } from 'lucide-react'
import { getDeleteAccountConfig, getApp } from '@/lib/db'

export default async function DeleteAccountPage() {
  const [app, config] = await Promise.all([getApp(), getDeleteAccountConfig()])

  const title = config?.title ?? 'How to Delete Your Account'
  const intro = config?.intro ?? `You can request deletion of your ${app.name} account and all associated data at any time.`
  const steps = config?.steps ?? []
  const dataDeleted = config?.data_deleted ?? []
  const contactEmail = config?.contact_email ?? app.contact_email
  const retentionText = config?.retention_text

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeftIcon className="size-4" />
        Back to home
      </Link>

      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground mb-10">{intro}</p>

      {steps.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Steps to Delete Your Account</h2>
          <ol className="space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <CheckCircleIcon className="size-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {dataDeleted.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Data That Will Be Deleted</h2>
          <ul className="space-y-2">
            {dataDeleted.map((item, i) => (
              <li key={i} className="flex gap-3 items-center">
                <Trash2Icon className="size-4 text-destructive shrink-0" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {retentionText && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Data Retention</h2>
          <p className="text-sm text-muted-foreground">{retentionText}</p>
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MailIcon className="size-4" />
          <a href={`mailto:${contactEmail}`} className="underline hover:text-foreground">
            {contactEmail}
          </a>
        </p>
      </section>

      <footer className="text-xs text-muted-foreground border-t pt-4 flex gap-4">
        <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
          Privacy Policy
        </Link>
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
      </footer>
    </main>
  )
}
