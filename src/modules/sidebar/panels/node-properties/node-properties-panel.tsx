import { useNodes, } from '@xyflow/react'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import {  useMemo } from 'react'
import SplitPane, { Pane } from 'split-pane-react'

import SidebarPanelHeading from '~/modules/sidebar/components/sidebar-panel-heading'
import SidebarPanelWrapper from '~/modules/sidebar/components/sidebar-panel-wrapper'
import { NodePropertyPanel } from '~/modules/sidebar/panels/node-properties/components/node-propery-panel'
import IntroductionPropertyPanel from '~/modules/sidebar/panels/node-properties/property-panels/introduction-property-panel'
import NoVariablePanel from '~/modules/sidebar/panels/node-properties/variable-panels/no-variable-panel'
import NodeVariablePropertiesPanel from '~/modules/sidebar/panels/node-properties/variable-panels/variable-panel'
import { useApplicationState } from '~/stores/application-state'
import { defaultOverlayScrollbarsOptions } from '~/utils/overlayscrollbars'

export function NodePropertiesPanel() {
  const { paneSizes, selectedNode, setPaneSizes } = useApplicationState(s => ({
    paneSizes: s.sidebar.panels.nodeProperties.paneSizes,
    setPaneSizes: s.actions.sidebar.panels.nodeProperties.setPaneSizes,
    selectedNode: s.sidebar.panels.nodeProperties.selectedNode,
    setSelectedNode: s.actions.sidebar.panels.nodeProperties.setSelectedNode,
  }))

  const nodes = useNodes()
  const selectedNodeData = useMemo(() => {
    return nodes.find(n => n.id === selectedNode?.id)?.data
  }, [nodes, selectedNode?.id])

  return (
    <SidebarPanelWrapper>
      <SplitPane
        sizes={paneSizes}
        sashRender={() => <div className="bg-dark-300) <md:hover(scale-y-100 h-0.5 bg-dark-300 transition hover:(scale-y-200 bg-teal-800/50)" />}
        onChange={setPaneSizes}
        split="horizontal"
      >

        <Pane minSize={80}>
          <div className="h-full flex flex-col">
            <SidebarPanelHeading className="shrink-0">
              <div className="i-mynaui:code-diamond size-4.5" />
              变量信息
            </SidebarPanelHeading>
            <OverlayScrollbarsComponent className='grow' defer options={defaultOverlayScrollbarsOptions}>
              {selectedNode && selectedNode.type !== 'end' ? <NodeVariablePropertiesPanel id={selectedNode.id} type={selectedNode.type} data={selectedNodeData} /> : <NoVariablePanel />}
            </OverlayScrollbarsComponent>
          </div>
        </Pane>



        <Pane minSize={200}>
          <div className="h-full flex flex-col">
            <SidebarPanelHeading className="shrink-0">
              <div className="i-mynaui:cog size-4.5" />
              节点属性
            </SidebarPanelHeading>

            <OverlayScrollbarsComponent className="grow" defer options={defaultOverlayScrollbarsOptions}>
              {selectedNode
                ? <NodePropertyPanel id={selectedNode.id} type={selectedNode.type} data={selectedNodeData} />
                : <IntroductionPropertyPanel />}
            </OverlayScrollbarsComponent>
          </div>
        </Pane>


        
      </SplitPane>



    </SidebarPanelWrapper>
  )
}
