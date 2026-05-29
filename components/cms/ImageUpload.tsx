"use client"

import * as React from "react"
import { UploadCloudIcon, XIcon, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { uploadLandingAsset } from "@/app/actions/landing"
import { toast } from "sonner"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  storagePath: string
  label?: string
  className?: string
}

export function ImageUpload({ value, onChange, storagePath, label, className }: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('path', storagePath)
      const url = await uploadLandingAsset(fd)
      onChange(url)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {value ? (
        <div className="relative group w-full rounded-lg overflow-hidden border border-border">
          <img src={value} alt="Upload preview" className="w-full max-h-40 object-contain bg-muted/20" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              <UploadCloudIcon className="size-4" />
              Replace
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onChange('')}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-border py-6 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span>Uploading…</span>
          ) : (
            <>
              <ImageIcon className="size-6" />
              <span>Click to upload</span>
              <span className="text-xs">PNG, JPG, WebP — max 5 MB</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
