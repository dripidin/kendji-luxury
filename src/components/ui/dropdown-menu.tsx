'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface DropdownMenuContextValue {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggle: () => void
  close: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
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
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)

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

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, toggle, close, triggerRef }}>
      <div className="relative inline-block text-left">
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
  const { toggle, open, triggerRef } = useDropdownMenu()

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      disabled={disabled}
      onClick={e => {
        e.stopPropagation()
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
  const { open, close, triggerRef } = useDropdownMenu()
  const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const menuEl = menuRef.current
    const menuWidth = menuEl?.offsetWidth || 192
    const menuHeight = menuEl?.offsetHeight || 150
    const margin = 6

    // Vertical positioning
    let top = rect.bottom + margin
    // If overflowing viewport bottom, position above trigger
    if (top + menuHeight > window.innerHeight - 8 && rect.top - menuHeight - margin > 8) {
      top = rect.top - menuHeight - margin
    }

    // Horizontal positioning
    let left = rect.right - menuWidth
    if (align === 'start') {
      left = rect.left
    } else if (align === 'center') {
      left = rect.left + rect.width / 2 - menuWidth / 2
    }

    // Ensure within viewport bounds
    left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, left))
    top = Math.max(8, top)

    setCoords({ top, left })
  }, [align, triggerRef])

  React.useLayoutEffect(() => {
    if (open) {
      updatePosition()
    }
  }, [open, updatePosition])

  React.useEffect(() => {
    if (!open) return

    const handleScrollOrResize = () => {
      updatePosition()
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        close()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
    document.addEventListener('mousedown', handleClickOutside, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
      document.removeEventListener('mousedown', handleClickOutside, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, close, triggerRef, updatePosition])

  if (!open || !mounted) return null

  const content = (
    <div
      ref={menuRef}
      role="menu"
      style={{
        position: 'fixed',
        top: coords ? `${coords.top}px` : '-9999px',
        left: coords ? `${coords.left}px` : '-9999px',
        zIndex: 99999
      }}
      className={cn(
        'min-w-[11rem] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 text-gray-900 shadow-xl ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-100',
        className
      )}
      onClick={e => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  )

  return createPortal(content, document.body)
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
