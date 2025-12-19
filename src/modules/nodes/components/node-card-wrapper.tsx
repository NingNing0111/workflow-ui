import { DeleteOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons"
import { Button, Card, Divider, Space, Tooltip, Typography } from "antd"
import { useCallback, useMemo } from "react"
import type { NodeTypes } from "~/modules/nodes/types"
import { getNodeDetail } from "~/modules/nodes/utils"
import { useApplicationState } from "~/stores/application-state"
import { cn } from "~@/utils/cn"

export interface NodeCardWrapperProps {
    type: NodeTypes
    id: string;
    selected: boolean,
    children: React.ReactNode;
}

const NodeCardWrapper = ({ type, id, selected, children }: NodeCardWrapperProps) => {
    const meta = useMemo(() => getNodeDetail(type), [])
    const [showNodePropertiesOf] = useApplicationState(s => [s.actions.sidebar.showNodePropertiesOf])
    const showNodeProperties = useCallback(() => {
        showNodePropertiesOf({ id, type: type })
    }, [id, showNodePropertiesOf])
    const deleteNode = (id: string) => {

    }

    return <Card
        size="small"
        onDoubleClick={showNodeProperties}
        className={cn(
            'w-xs backdrop-blur-xl transition',
            selected && 'ring-1  border-purple-600'
        )}
        styles={{
            body: { padding: 0 },
        }}
        variant='outlined'
        title={
            <Space size={6}>
                <div className="size-6 flex items-center justify-center rounded-lg">
                    <div className={cn(meta.icon, 'size-4')} />
                </div>
                <Typography.Text
                    type="secondary"
                    className=" font-medium uppercase tracking-wide"
                >
                    {meta.title}
                </Typography.Text>
            </Space>
        }
        extra={
            <Space size={4}>
                <Tooltip title="查看节点">
                    <Button
                        size="small"
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={showNodeProperties}
                    />
                </Tooltip>

                <Tooltip title="编辑">
                    <Button
                        size="small"
                        type="text"
                        icon={<SettingOutlined />}
                        onClick={showNodeProperties}
                    />
                </Tooltip>

                <Tooltip title="删除">
                    <Button
                        size="small"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteNode(id)}
                    />
                </Tooltip>
            </Space>
        }
    >
        {/* Content */}
        {children}

        <Divider style={{ margin: 0 }} />

        {/* Footer */}
        <div className="px-4 py-2 text-xs">
            <Typography.Text type="secondary">
                Node:{' '}
                <Typography.Text type="secondary">
                    #{id}
                </Typography.Text>
            </Typography.Text>
        </div>
    </Card>
}


export default NodeCardWrapper;