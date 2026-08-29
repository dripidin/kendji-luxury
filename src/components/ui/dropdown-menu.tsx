'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggle: () => void
  close: () => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

export function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error('useDropdownMenu must be used within a DropdownMenu')
  }
  return context
}

export function DropdownMenu({
  children,
  open: controlledOpen,
  onOpenChange
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      const next = typeof value === 'function' ? value(open) : value
      if (!isControlled) {
        setUncontrolledOpen(next)
      }
      onOpenChange?.(next)
    },
    [isControlled, open, onOpenChange]
  )

  const toggle = React.useCallback(() => {
    setOpen(prev => !prev)
  }, [setOpen])

  const close = React.useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, close])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, toggle, close }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({
  className,
  children,
  onClick,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle, open } = useDropdownMenu()

  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      disabled={disabled}
      onClick={e => {
        onClick?.(e)
        toggle()
      }}
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  className,
  align = 'end',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: 'start' | 'center' | 'end'
}) {
  const { open } = useDropdownMenu()

  if (!open) return null

  const alignClass =
    align === 'start'
      ? 'left-0 origin-top-left'
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2 origin-top'
      : 'right-0 origin-top-right'

  return (
    <div
      role="menu"
      className={cn(
        'absolute z-50 mt-1.5 min-w-[10rem] overflow-hidden rounded-lg border bg-white p-1 text-gray-900 shadow-lg ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-100',
        alignClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-0.5', className)} {...props} />
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider', className)}
      {...props}
    />
  )
}

export function DropdownMenuItem({
  className,
  onClick,
  disabled,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean
}) {
  const { close } = useDropdownMenu()

  return (
    <div
      role="menuitem"
      aria-disabled={disabled}
      onClick={e => {
        if (disabled) return
        onClick?.(e)
        close()
      }}
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-xs outline-hidden transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 text-gray-700',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('-mx-1 my-1 h-px bg-gray-100', className)} {...props} />
}

export function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
