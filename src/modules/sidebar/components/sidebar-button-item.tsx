import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '~@/utils/cn'

type SidebarButtonItemProps = Readonly<ComponentPropsWithoutRef<'button'> & {
  active?: boolean;
}>

export default function SidebarButtonItem({ children, className, active, ...props }: SidebarButtonItemProps) {
  return (
    <button type="button" className={cn('size-8 flex items-center justify-center rounded-lg border border-transparent outline-none transition', [active ? 'border-teal-700 ' : 'bg-transparent'], className)} {...props}>
      {children}
    </button>
  )
}
