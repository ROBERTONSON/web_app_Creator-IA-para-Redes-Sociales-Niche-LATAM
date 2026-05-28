'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContentCardProps {
  title: string
  content: string | string[]
  icon?: React.ReactNode
}

export default function ContentCard({ title, content, icon }: ContentCardProps) {
  const [copied, setCopied] = useState(false)

  const displayText = Array.isArray(content)
    ? content.map((h) => `#${h}`).join(' ')
    : content

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(displayText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available — silently fail
    }
  }

  return (
    <Card className="relative group">
      <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
          {icon}
          {title}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className={cn(
            'h-7 px-2 gap-1.5 text-xs transition-all duration-150',
            copied
              ? 'text-green-500 hover:text-green-500'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-label={`Copiar ${title}`}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copiado' : 'Copiar'}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{displayText}</p>
      </CardContent>
    </Card>
  )
}
