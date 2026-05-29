import type { StepItem } from '@/lib/types'

export function LandingSteps({
  title,
  items,
  dark = false,
}: {
  title?: string
  items: StepItem[]
  dark?: boolean
}) {
  return (
    <section
      className="py-20"
      style={dark ? { backgroundColor: 'var(--color-accent)' } : { backgroundColor: 'var(--background)' }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {title && (
          <h2 className={`text-3xl font-bold text-center mb-14 ${dark ? 'text-white' : ''}`}>
            {title}
          </h2>
        )}
        <div className="grid md:grid-cols-3 gap-10">
          {items.map((step, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div
                className="flex size-12 items-center justify-center rounded-full text-xl font-bold text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {i + 1}
              </div>
              <h3 className={`font-semibold text-lg ${dark ? 'text-white' : ''}`}>{step.title}</h3>
              <p className={`text-sm leading-relaxed ${dark ? 'text-white/70' : 'text-muted-foreground'}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
