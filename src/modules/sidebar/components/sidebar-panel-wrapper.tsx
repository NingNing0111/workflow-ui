import type { ComponentPropsWithoutRef } from 'react'

import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'

import { cn } from '~@/utils/cn'

import { defaultOverlayScrollbarsOptions } from '~/utils/overlayscrollbars.ts'
import { Button,  theme } from 'antd'
import { useApplicationState } from '~/stores/application-state'
import { CloseOutlined } from '@ant-design/icons'

type SidebarPanelWrapperProps = Readonly<ComponentPropsWithoutRef<'div'>>

export default function SidebarPanelWrapper({ children, className, ...props }: SidebarPanelWrapperProps) {

  const {
    showSidebar,
    toggleSidebar,
  } = useApplicationState(s => ({
    isMobileView: s.view.mobile,
    activePanel: s.sidebar.active,
    showSidebar: s.sidebar.showSidebar,
    setActivePanel: s.actions.sidebar.setActivePanel,
    toggleSidebar: s.actions.sidebar.toggleSidebar,
  }))

  const closePanel = () => {
    if (showSidebar) {
      toggleSidebar();
    }
  }

  const {token} = theme.useToken();
  return (
    <div
      className={cn(
        'relative flex flex-col h-[800px]',
        // 圆角 & 背景
        'rounded-2xl bg-white dark:bg-zinc-900',
        // 阴影层次
        'shadow-sm hover:shadow-md transition-shadow',
        // 边框（可选）
        'border border-zinc-200/70 dark:border-zinc-700/60',
        // 裁切，避免滚动条/按钮溢出
        'overflow-hidden',
        className
      )}

      style={{
        backgroundColor: token.colorBgContainer,
        marginRight: 20,
        marginTop: 10
      }}
      {...props}
    >
      <OverlayScrollbarsComponent
        className="grow"
        defer
        options={defaultOverlayScrollbarsOptions}
      >
        <Button
          icon={<CloseOutlined />}
          size="small"
          type="text"
          onClick={closePanel}
          className="
        absolute right-3 top-3 z-10
        rounded-full
        hover:bg-black/5 dark:hover:bg-white/10
      "
        />
        {children}
      </OverlayScrollbarsComponent>
    </div>


  )
}
