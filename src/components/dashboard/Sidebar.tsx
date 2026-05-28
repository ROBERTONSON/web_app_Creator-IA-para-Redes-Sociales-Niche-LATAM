'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Sparkles, History, LayoutDashboard, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Generador', icon: LayoutDashboard },
  { href: '/history', label: 'Historial', icon: History },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-card border border-border text-foreground"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-full w-64 flex flex-col bg-card border-r border-border',
          'transition-transform duration-300 ease-in-out',
          'md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Sparkles size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Creator IA</p>
            <p className="text-xs text-muted-foreground mt-0.5">LATAM</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                  'transition-colors duration-150',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Demo badge */}
        <div className="px-4 py-4 border-t border-border">
          <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-center">
            <p className="text-xs text-primary font-medium">Modo Demo</p>
            <p className="text-xs text-muted-foreground mt-0.5">MVP — Creator IA LATAM</p>
          </div>
        </div>
      </aside>
    </>
  )
}
