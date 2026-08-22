'use client'

import { cn, stringToColor, getInitials } from '@/lib/utils'

interface AvatarProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const bg = stringToColor(name)
  const initials = getInitials(name)

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 select-none',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: bg }}
      aria-label={name}
    >
      {initials}
    </div>
  )
}
