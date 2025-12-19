import { BugOutlined, CodeOutlined } from "@ant-design/icons";
import XMarkdown from "@ant-design/x-markdown";
import { useNodesData, useReactFlow } from "@xyflow/react";
import { Empty, theme, Typography } from "antd";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useEffect, useRef, useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

import { debugWorkflow } from "~/api/workflow";
import { useSelectNode } from "~/modules/flow-builder/hooks/use-node-selected";
import { DEFAULT_START_ID, type NodeIOData } from "~/modules/nodes/types";
import SidebarPanelHeading from "~/modules/sidebar/components/sidebar-panel-heading";
import SidebarPanelWrapper from "~/modules/sidebar/components/sidebar-panel-wrapper";
import { DynamicInputForm } from "~/modules/sidebar/panels/online-debug/components/DynamicInputForm";
import { useDebugStore } from "~/stores/debug-state";
import { defaultOverlayScrollbarsOptions } from "~/utils/overlayscrollbars";

type StartNodeData = {
    nodeConfig?: {
        userInputs?: NodeIOData[];
    };
};



const OnlineDebugPanel = () => {
    const {getNodes, getEdges} = useReactFlow();
    const nodes = getNodes();
    const edges = getEdges();
  const nodeData = useNodesData(DEFAULT_START_ID);
  const [sizes, setSizes] = useState<number[]>([320, 180]);
  const [userInputs, setUserInputs] = useState<NodeIOData[]>([]);
  const { token } = theme.useToken();

  const debugSSE = useDebugStore(s => s.onSSE);
  const playRun = useDebugStore(s => s.playRun);

  const latestRun = useDebugStore(s => s.getLatestRun());
  const currentNodeId = latestRun?.currentNodeId;
  const streamOutput = latestRun?.streamOutput ?? "";

  useSelectNode(currentNodeId, { fitView: true, duration: 300 });

  useEffect(() => {
    const data = nodeData?.data as StartNodeData | undefined;
    setUserInputs(data?.nodeConfig?.userInputs ?? []);
  }, [nodeData?.data]);


    const debug = (values: Record<string, any>) => {
        // 设置用户消息 和初始化AI消息
        const inputs = userInputs.map((input) => ({
            name: input.name,
            content: {
                label: input.label,
                value: values[input.name] ?? "", // 从传入 values 获取对应值，没有则为空
                type: input.type,
            },
        }));
        debugWorkflow({
            workflowId: import.meta.env.VITE_APP_TEXT_WORKFLOW_ID,
            nodes,
            edges,
            inputs
        }, {
            onMessage(event) {
                if (event.data) {
                    debugSSE(event.data);
                }
            },

        })

        playRun(import.meta.env.VITE_APP_TEXT_WORKFLOW_ID, 400);
    }
    useEffect(() => {
        const data = nodeData?.data as StartNodeData | undefined;
        setUserInputs(data?.nodeConfig?.userInputs ?? []);
    }, [nodeData?.data]);

    return (
        <SidebarPanelWrapper>
            <SplitPane
                split="horizontal"
                sizes={sizes}
                onChange={setSizes}
                className="flex-1"
                sashRender={() => (
                    <div className="h-1 bg-dark-300 transition hover:bg-teal-800/50 cursor-row-resize" />
                )}
            >
                {/* 消息区 */}
                <Pane minSize={80}>
                    <div className="h-full flex flex-col">
                        <SidebarPanelHeading icon={<BugOutlined />} title="调试台" />
                        <OverlayScrollbarsComponent className='grow' defer options={defaultOverlayScrollbarsOptions}>
                            {streamOutput ? (
                                <Typography className="px-6 py-2" style={{ backgroundColor: token.colorBgBlur }}>
                                    <XMarkdown content={streamOutput} />
                                </Typography>
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <Empty description="输入参数，开始调试" />
                                </div>
                            )}
                        </OverlayScrollbarsComponent>
                    </div>
                </Pane>

                {/* 输入区 */}
                <Pane minSize={180}>
                    <SidebarPanelHeading title="输入参数" icon={<CodeOutlined />} />
                    <OverlayScrollbarsComponent>
                        <div className="py-5">
                            <DynamicInputForm
                                userInputs={userInputs}
                                onSubmit={(values) => {
                                    debug(values);
                                }}
                            />
                        </div>
                    </OverlayScrollbarsComponent>
                </Pane>
            </SplitPane>
        </SidebarPanelWrapper>
    );
};

export default OnlineDebugPanel;
