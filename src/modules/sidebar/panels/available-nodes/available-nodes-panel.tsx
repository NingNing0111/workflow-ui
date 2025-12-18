import { ProductOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import { useInsertNode } from '~/modules/flow-builder/hooks/use-insert-node'
import { AVAILABLE_NODES } from '~/modules/nodes'
import SidebarPanelWrapper from '~/modules/sidebar/components/sidebar-panel-wrapper'
import { NodePreviewDraggable } from '~/modules/sidebar/panels/available-nodes/components/node-preview-draggable'
import { useAppAppearanceStore } from '~/stores/appearanceStore'
import { useApplicationState } from '~/stores/application-state'

export default function AvailableNodesPanel() {
  const { isMobileView, setActivePanel } = useApplicationState(s => ({
    isMobileView: s.view.mobile,
    setActivePanel: s.actions.sidebar.setActivePanel,
  }))
  const insertNode = useInsertNode()
  const isDark = useAppAppearanceStore(s => s.theme === 'dark')

  return (
    <SidebarPanelWrapper >
      <div className="mt-4 flex flex-col items-center p-4 text-center">
        <div className={`text-10 ${isDark ? 'text-white' : 'text-black'} `}>
          <ProductOutlined />
        </div>
        <Typography.Text> 可用节点</Typography.Text>
        <Typography.Text> 拖放节点来构建您的工作流程中</Typography.Text>

      </div>

      <div className="grid grid-cols-1 gap-4 p-4">
        {AVAILABLE_NODES.map(node => (
          <NodePreviewDraggable
            key={node.type}
            type={node.type}
            icon={node.icon}
            title={node.title}
            description={node.description}
            isMobileView={isMobileView}
            setActivePanel={setActivePanel}
            insertNode={insertNode}
          />
        ))}
      </div>
    </SidebarPanelWrapper>
  )
}
