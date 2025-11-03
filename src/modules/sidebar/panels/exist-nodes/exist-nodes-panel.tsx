import { useNodes, useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import SplitPane, { Pane } from "split-pane-react";
import { BuilderNode } from "~/modules/nodes/types";
import SidebarPanelHeading from "~/modules/sidebar/components/sidebar-panel-heading";
import SidebarPanelWrapper from "~/modules/sidebar/components/sidebar-panel-wrapper"
import { NodeListItem } from "~/modules/sidebar/panels/node-properties/components/node-list-item";
import { useNodeList } from "~/modules/sidebar/panels/node-properties/hooks/use-node-list";
import { useApplicationState } from "~/stores/application-state";
import { trackSomethingInNodeProperties } from "~/utils/ga4";
import { defaultOverlayScrollbarsOptions } from '~/utils/overlayscrollbars'
const ExistNodesPanel = () => {

    const { paneSizes, selectedNode, setPaneSizes, setSelectedNode } = useApplicationState(s => ({
        paneSizes: s.sidebar.panels.nodeProperties.paneSizes,
        setPaneSizes: s.actions.sidebar.panels.nodeProperties.setPaneSizes,
        selectedNode: s.sidebar.panels.nodeProperties.selectedNode,
        setSelectedNode: s.actions.sidebar.panels.nodeProperties.setSelectedNode,
    }))
    const nodes = useNodes()
    const nodeList = useNodeList(nodes)

    const { setNodes } = useReactFlow()
    const onNodeClick = (id: string) => {
        setNodes(nds => produce(nds, (draft) => {
            draft.forEach((node) => {
                node.selected = node.id === id
            })
        }))

        setSelectedNode({ id, type: nodeList.find(n => n.id === id)?.type as BuilderNode })
    }
    return <SidebarPanelWrapper>
        <div className="h-full flex flex-col">
            <SidebarPanelHeading className="shrink-0">
                <div className="i-mynaui:layers-three size-4.5" />
                流程中的节点
            </SidebarPanelHeading>

            <OverlayScrollbarsComponent className="grow" defer options={defaultOverlayScrollbarsOptions}>
                <div className="flex flex-col gap-1 p-1.5">
                    {nodeList.map(node => (
                        <NodeListItem
                            key={node.id}
                            id={node.type === BuilderNode.START || node.type === BuilderNode.END ? undefined : node.id}
                            title={node.detail.title}
                            icon={`${node.detail.icon} ${node.type === BuilderNode.START || node.type === BuilderNode.END ? 'scale-135' : ''}`}
                            selected={selectedNode?.id === node.id}
                            pseudoSelected={node.selected}
                            onClick={() => {
                                trackSomethingInNodeProperties('view-node-properties')
                                onNodeClick(node.id)
                            }}
                        />
                    ))}
                </div>
            </OverlayScrollbarsComponent>
        </div>
    </SidebarPanelWrapper>
}

export default ExistNodesPanel;