import type { ApplicationState } from '~/stores/application-state'

import { useEffect, useRef } from 'react'

import { SwitchSidebarPanel } from '~/modules/sidebar/components/sidebar-switch-panel'
import { Button, Divider, Layout, Space } from 'antd'
import { ApartmentOutlined, BugOutlined, ProductOutlined, SettingOutlined } from '@ant-design/icons'

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


  const handleButtonClick = (activePanel: ApplicationState['sidebar']['active']) => {
    setActivePanel(activePanel)
    if (!showSidebar) {
      toggleSidebar()
    }
  }


  const SiderbarButton = ({ icon, panelName }: { icon: React.ReactNode, panelName: ApplicationState['sidebar']['active'] }) => {
    return <Button icon={icon} className={`${activePanel === panelName ? 'border-blue' : 'border-0'}`} onClick={() => handleButtonClick(panelName)} />
  }

  return (
    <div className="relative flex w-12 justify-center border-0">
      {/* 左侧 Panel（相对于 Space 展开） */}
      {activePanel !== 'none' && showSidebar && (
        <div
          className="
        absolute
        right-full
        top-0
        min-w-sm
        h-full
      "
        >
          <SwitchSidebarPanel active={activePanel} />
        </div>
      )}

      {/* 右侧按钮列 */}
      <Space orientation="vertical" size={8}>
        <SiderbarButton icon={<ProductOutlined />} panelName='available-nodes' />
        <SiderbarButton icon={<ApartmentOutlined />} panelName='exist-nodes' />
        <SiderbarButton icon={<SettingOutlined />} panelName='node-properties' />
        <Divider style={{ margin: '4px 0' }} />
        <SiderbarButton icon={<BugOutlined />} panelName='online-debug' />
      </Space>
    </div>

  )
}
