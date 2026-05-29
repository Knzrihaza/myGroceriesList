import { getApp, getRules } from "@/lib/db"

export default async function PrivacyPolicyPage() {
  const [app, rules] = await Promise.all([getApp(), getRules()])

  const lastUpdated =
    rules.length > 0
      ? new Date(
          Math.max(...rules.map((r) => new Date(r.updated_at).getTime()))
        ).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">
        <strong>{app.name}</strong> &middot; {app.contact_email} &middot; Last
        updated: {lastUpdated}
      </p>

      <p className="text-muted-foreground mb-10">
        This policy describes how <strong>{app.developer}</strong> collects,
        uses, and protects your personal data when you use {app.name}. We are
        committed to transparency and your right to privacy.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Data We Collect</h2>
        {rules.length === 0 ? (
          <p className="text-muted-foreground">
            No data collection rules defined yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-semibold">Data</th>
                  <th className="text-left py-2 pr-4 font-semibold">Purpose</th>
                  <th className="text-left py-2 pr-4 font-semibold">
                    Retention
                  </th>
                  <th className="text-left py-2 pr-4 font-semibold">
                    Third Parties
                  </th>
                  <th className="text-left py-2 font-semibold">Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">
                      {rule.data_collected}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {rule.purpose}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {rule.retention}
                    </td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {rule.third_parties}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {rule.legal_basis}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
        <p className="text-muted-foreground">
          You have the right to access, correct, or delete your personal data at
          any time. To exercise these rights, contact us at{" "}
          <strong>{app.contact_email}</strong>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Changes to This Policy</h2>
        <p className="text-muted-foreground">
          We may update this policy as our practices change. The &ldquo;Last
          updated&rdquo; date at the top of this page reflects the most recent
          revision.
        </p>
      </section>

      <footer className="text-xs text-muted-foreground border-t pt-4">
        &copy; {new Date().getFullYear()} {app.developer}. All rights reserved.
      </footer>
    </main>
  )
}
