import type { ApplicationState } from '~/stores/application-state'

import { useEffect, useRef } from 'react'

import SidebarButtonItem from '~/modules/sidebar/components/sidebar-button-item'
import { SwitchSidebarPanel } from '~/modules/sidebar/components/sidebar-switch-panel'

type DesktopSidebarFragmentProps = Readonly<{
  isMobileView: ApplicationState['view']['mobile'];
  activePanel: ApplicationState['sidebar']['active'];
  showSidebar: ApplicationState['sidebar']['showSidebar'];
  setActivePanel: (panel: ApplicationState['sidebar']['active']) => void;
  toggleSidebar: () => void;
}>


function useSingleAndDoubleClick(
  onClick: () => void,
  onDoubleClick: () => void,
  delay = 200
) {
  const timer = useRef<number | null>(null)

  return {
    onClick: () => {
      timer.current = window.setTimeout(() => {
        onClick()
        timer.current = null
      }, delay)
    },
    onDoubleClick: () => {
      if (timer.current) {
        clearTimeout(timer.current)
        timer.current = null
      }
      onDoubleClick()
    },
  }
}

function useSidebarButtonClick(
  panel: ApplicationState['sidebar']['active'],
  activePanel: ApplicationState['sidebar']['active'],
  showSidebar: boolean,
  setActivePanel: (panel: ApplicationState['sidebar']['active']) => void,
  toggleSidebar: () => void,
) {
  return useSingleAndDoubleClick(
    // 单击
    () => {
      setActivePanel(panel)

      // panel 被隐藏时，单击任何按钮都要展示
      if (!showSidebar) {
        toggleSidebar()
      }
    },
    // 双击
    () => {
      // 仅当前选中的 button 才能 toggle
      if (activePanel === panel) {
        toggleSidebar()
      }
    },
  )
}


export function DesktopSidebarFragment({ isMobileView, activePanel, setActivePanel, showSidebar, toggleSidebar }: DesktopSidebarFragmentProps) {

  useEffect(() => {
    if (!isMobileView && showSidebar && activePanel === 'none') {
      setActivePanel('available-nodes')
    }
  }, [
    activePanel,
    setActivePanel,
    isMobileView,
    showSidebar,
  ])



  const availableNodesClick = useSidebarButtonClick(
    'available-nodes',
    activePanel,
    showSidebar,
    setActivePanel,
    toggleSidebar,
  )

  const existNodesClick = useSidebarButtonClick(
    'exist-nodes',
    activePanel,
    showSidebar,
    setActivePanel,
    toggleSidebar,
  )

  const nodePropsClick = useSidebarButtonClick(
    'node-properties',
    activePanel,
    showSidebar,
    setActivePanel,
    toggleSidebar,
  )

  const onlineDebugClick = useSidebarButtonClick(
    "online-debug",
    activePanel,
    showSidebar,
    setActivePanel,
    toggleSidebar,
  )

  return (
    <div className="relative w-auto flex shrink-0 divide-x divide-dark-300">
      {activePanel !== 'none' && showSidebar && (
        <div className="min-w-sm grow bg-dark-500">
          <SwitchSidebarPanel active={activePanel} />
        </div>
      )}

      <div className="shrink-0 bg-dark-400 p-1.5">
        <div className="h-full flex flex-col gap-2">
          <SidebarButtonItem
            active={activePanel === 'available-nodes'}
            {...availableNodesClick}
          >
            <div className="i-mynaui:grid size-5" />
          </SidebarButtonItem>


          <SidebarButtonItem
            active={activePanel === 'exist-nodes'}
            {...existNodesClick}
          >
            <div className="i-mynaui:package size-5" />
          </SidebarButtonItem>

          <SidebarButtonItem
            active={activePanel === 'node-properties'}
            {...nodePropsClick}
          >
            <div className="i-mynaui:layers-three size-5" />
          </SidebarButtonItem>
          <div className="mx-a h-px w-4 bg-dark-100" />
          <SidebarButtonItem
            active={activePanel === 'online-debug'}
            {...onlineDebugClick}
          >
            <div className="i-mynaui:code-octagon size-5" />
          </SidebarButtonItem>
        </div>
      </div>
    </div>
  )
}
