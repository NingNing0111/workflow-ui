import { createFileRoute } from '@tanstack/react-router'
import { ReactFlowProvider } from '@xyflow/react'
import { Layout } from 'antd'
import { useEffect } from 'react'

import { FlowBuilderModule } from '~/modules/flow-builder/flow-builder-module'
import { NavigationBarModule } from '~/modules/navigation-bar/navigation-bar-module'
import { SidebarModule } from '~/modules/sidebar/sidebar-module'
import { ToasterModule } from '~/modules/toaster/toaster-module'
import { AddNodeOnEdgeDropStateProvider } from '~/stores/add-node-on-edge-drop-state'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {

  useEffect(() => {
    // createWorkflow({title: "工作流测试", description: "开发测试工作流"})
  }, [])
  return (
    <Layout >
      <ReactFlowProvider >
        <NavigationBarModule />
        <div className="flex flex-col h-dvh divide-y ">
          <div className="flex grow of-y-hidden ">
            <div className="grow ">
              <AddNodeOnEdgeDropStateProvider>
                <FlowBuilderModule />
              </AddNodeOnEdgeDropStateProvider>
            </div>
            <SidebarModule />
          </div>
        </div>
      </ReactFlowProvider>
    </Layout>

  )
}
