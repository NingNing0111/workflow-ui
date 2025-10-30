import { useInsertNode } from '~/modules/flow-builder/hooks/use-insert-node'
import { AVAILABLE_NODES } from '~/modules/nodes'
import SidebarPanelWrapper from '~/modules/sidebar/components/sidebar-panel-wrapper'
import { NodePreviewDraggable } from '~/modules/sidebar/panels/available-nodes/components/node-preview-draggable'
import { useApplicationState } from '~/stores/application-state'

export default function AvailableNodesPanel() {
  const { isMobileView, setActivePanel } = useApplicationState(s => ({
    isMobileView: s.view.mobile,
    setActivePanel: s.actions.sidebar.setActivePanel,
  }))
  const insertNode = useInsertNode()

  return (
    <SidebarPanelWrapper>
      <div className="mt-4 flex flex-col items-center p-4 text-center">
        <div className="size-12 flex items-center justify-center rounded-full bg-teal-800">
          <div className="i-mynaui:grid size-6 text-white" />
        </div>

        <div className="mt-4 text-balance font-medium">可用节点</div>

        <div className="mt-1 w-2/3 text-xs text-light-50/40 font-medium leading-normal">
          {isMobileView ? '点击节点即可将其添加到流程中。' : '拖放节点来构建您的工作流程中。'}
        </div>
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
