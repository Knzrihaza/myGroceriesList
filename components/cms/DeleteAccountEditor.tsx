"use client"

import * as React from "react"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { saveDeleteAccountConfig } from "@/app/actions/landing"
import type { DeleteAccountConfig } from "@/lib/types"

export function DeleteAccountEditor({ initial }: { initial: DeleteAccountConfig | null }) {
  const [config, setConfig] = React.useState<Partial<DeleteAccountConfig>>(
    initial ?? {
      title: 'How to Delete Your Account',
      intro: '',
      steps: [],
      data_deleted: [],
      contact_email: '',
      retention_text: '',
    }
  )
  const [isSaving, setIsSaving] = React.useState(false)

  function updateStep(i: number, partial: Partial<{ title: string; description: string }>) {
    const steps = [...(config.steps ?? [])]
    steps[i] = { ...steps[i], ...partial }
    setConfig((c) => ({ ...c, steps }))
  }

  async function save() {
    setIsSaving(true)
    try {
      const saved = await saveDeleteAccountConfig(config)
      setConfig(saved)
      toast.success('Saved')
    } catch {
      toast.error('Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl p-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Delete Account Page</h2>
        <Button onClick={save} disabled={isSaving} size="sm">
          {isSaving ? 'Saving…' : 'Save'}
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Page Title</Label>
        <Input value={config.title ?? ''} onChange={(e) => setConfig((c) => ({ ...c, title: e.target.value }))} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Intro Paragraph</Label>
        <Textarea value={config.intro ?? ''} onChange={(e) => setConfig((c) => ({ ...c, intro: e.target.value }))} rows={3} />
      </div>

      <div className="flex flex-col gap-3">
        <Label>Steps</Label>
        {(config.steps ?? []).map((step, i) => (
          <div key={i} className="rounded-lg border border-border p-3 flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Step {i + 1}</span>
              <Button size="icon" variant="ghost" onClick={() =>
                setConfig((c) => ({ ...c, steps: (c.steps ?? []).filter((_, j) => j !== i) }))}>
                <Trash2Icon className="size-3" />
              </Button>
            </div>
            <Input value={step.title} onChange={(e) => updateStep(i, { title: e.target.value })} placeholder="Step title" />
            <Textarea value={step.description} onChange={(e) => updateStep(i, { description: e.target.value })} rows={2} placeholder="Description" />
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() =>
          setConfig((c) => ({ ...c, steps: [...(c.steps ?? []), { title: '', description: '' }] }))}>
          <PlusIcon className="size-4" /> Add Step
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Data That Gets Deleted</Label>
        {(config.data_deleted ?? []).map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input value={item} onChange={(e) => {
              const data_deleted = [...(config.data_deleted ?? [])]
              data_deleted[i] = e.target.value
              setConfig((c) => ({ ...c, data_deleted }))
            }} />
            <Button size="icon" variant="ghost" onClick={() =>
              setConfig((c) => ({ ...c, data_deleted: (c.data_deleted ?? []).filter((_, j) => j !== i) }))}>
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() =>
          setConfig((c) => ({ ...c, data_deleted: [...(c.data_deleted ?? []), ''] }))}>
          <PlusIcon className="size-4" /> Add Item
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Contact Email</Label>
        <Input type="email" value={config.contact_email ?? ''} onChange={(e) => setConfig((c) => ({ ...c, contact_email: e.target.value }))} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Data Retention Info</Label>
        <Textarea value={config.retention_text ?? ''} onChange={(e) => setConfig((c) => ({ ...c, retention_text: e.target.value }))} rows={2} placeholder="e.g. Data is removed within 30 days." />
      </div>
    </div>
  )
}
