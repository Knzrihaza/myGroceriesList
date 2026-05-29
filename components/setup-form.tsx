"use client"

import { useActionState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createAdmin } from "@/app/actions/auth"

export function SetupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [state, action, isPending] = useActionState(createAdmin, null)

  return (
    <form className={cn("flex flex-col gap-6", className)} action={action} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create Admin Account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            No admin exists yet. Set up your account to get started.
          </p>
        </div>
        {state?.error && (
          <p className="text-sm text-destructive text-center rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
            {state.error}
          </p>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="admin@example.com"
            required
            autoComplete="email"
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm">Confirm Password</FieldLabel>
          <Input
            id="confirm"
            name="confirm"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Creating account…" : "Create Account"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
