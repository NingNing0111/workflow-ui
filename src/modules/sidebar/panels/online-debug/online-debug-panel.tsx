import { AntDesignOutlined, UserOutlined } from "@ant-design/icons";
import { Bubble, type BubbleListProps, type BubbleProps } from "@ant-design/x";
import XMarkdown from "@ant-design/x-markdown";
import { useNodesData, useReactFlow } from "@xyflow/react";
import { Avatar, Empty, Typography, type GetRef } from "antd";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useEffect, useMemo, useRef, useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

import { debugWorkflow } from "~/api/workflow";
import { DEFAULT_START_ID, type NodeIOData } from "~/modules/nodes/types";
import SidebarPanelHeading from "~/modules/sidebar/components/sidebar-panel-heading";
import SidebarPanelWrapper from "~/modules/sidebar/components/sidebar-panel-wrapper";
import { DynamicInputForm } from "~/modules/sidebar/panels/online-debug/components/DynamicInputForm";
import { defaultOverlayScrollbarsOptions } from "~/utils/overlayscrollbars";

interface Message {
    content: string;
    role: "user" | "assistant";
    key: string;
}

type StartNodeData = {
    nodeConfig?: {
        userInputs?: NodeIOData[];
    };
};

const renderMarkdown: BubbleProps['contentRender'] = (content) => {
  return (
    <Typography>
      <XMarkdown content={content} />
    </Typography>
  );
};

const OnlineDebugPanel = () => {
    const { getNodes, getEdges } = useReactFlow();
    const nodeData = useNodesData(DEFAULT_START_ID);
const debugBubbleListRef = useRef<GetRef<typeof Bubble.List>>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [sizes, setSizes] = useState<number[]>([320, 180]);
    const [userInputs, setUserInputs] = useState<NodeIOData[]>([]);

    const nodes = getNodes();
    const edges = getEdges();

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
        const userMessage: Message = {
            content: JSON.stringify(inputs),
            role: "user",
            key: `user-${Date.now()}`,
        };
        const aiMessage: Message = {
            content: "",
            role: "assistant",
            key: `role-${Date.now()}`
        }
        setMessages((prev) => [...prev, userMessage, aiMessage]);
        debugWorkflow({
            workflowId: import.meta.env.VITE_APP_TEXT_WORKFLOW_ID,
            nodes,
            edges,
            inputs
        }, {
            onMessage(event) {
                console.log(event.data);

                if (event.data.output) {
                    const text = event.data.output;
                    debugBubbleListRef.current?.scrollTo({top: "bottom", behavior: 'smooth'})
                    setMessages((prev) => {
                        const lastIndex = prev.findIndex((m) => m.role === "assistant" && m.key === aiMessage.key);
                        if (lastIndex === -1) return prev;

                        const updated = [...prev];
                        updated[lastIndex] = {
                            ...updated[lastIndex],
                            content: updated[lastIndex].content + text, // 追加新片段
                        };
                        return updated;
                    });
                }
            },

        })
    }
    useEffect(() => {
        const data = nodeData?.data as StartNodeData | undefined;
        setUserInputs(data?.nodeConfig?.userInputs ?? []);
    }, [nodeData?.data]);

    const roleConfig: BubbleListProps["role"] = useMemo(
        () => ({
            assistant: {
                typing: true,
                header: "AI",
                avatar: () => <Avatar icon={<AntDesignOutlined />} />,
                contentRender: renderMarkdown
            },
            user: (data) => ({
                placement: "end",
                header: `User-${data.key}`,
                avatar: () => <Avatar icon={<UserOutlined />} />,
            }),
        }),
        []
    );

    return (
        <SidebarPanelWrapper className="flex flex-col h-full">
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
                <Pane minSize={120}>

                    <div className="h-full flex flex-col">
                        <SidebarPanelHeading className="shrink-0">
                            <div className="i-mynaui:code-diamond size-4.5" />
                            调试台
                        </SidebarPanelHeading>
                        <OverlayScrollbarsComponent className='grow' defer options={defaultOverlayScrollbarsOptions}>
                            {messages.length > 0 ? (
                                <Bubble.List
                                    className="text-white"
                                    role={roleConfig}
                                    items={messages}
                                    ref={debugBubbleListRef}
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <Empty description="输入参数，开始调试" />
                                </div>
                            )}
                        </OverlayScrollbarsComponent>
                    </div>
                </Pane>

                {/* 输入区 */}
                <Pane minSize={80}>
                    <SidebarPanelHeading className="shrink-0">
                        <div className="i-mynaui:code-diamond size-4.5" />
                        输入参数
                    </SidebarPanelHeading>
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
