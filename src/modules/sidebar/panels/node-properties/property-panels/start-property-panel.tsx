import { useState } from 'react'
import {
    type NodeIOData,
    type BaseNodeData,
    type BuilderNodeType,
    InputTypeOptions,
} from '~/modules/nodes/types'
import UnavailableNodePropertyPanel from '~/modules/sidebar/panels/node-properties/property-panels/unavailable-property-panel'

import {
    Button,
    Card,
    Form,
    Input,
    Modal,
    Popconfirm,
    Select,
    Space,
    Typography,
    theme,
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

export interface UserInputNodeData {
    userInputs: NodeIOData[]
}

type StartNodePropertyPanelProps = Readonly<{
    id: string
    type: BuilderNodeType
    data: BaseNodeData<UserInputNodeData>
    updateData: (data: Partial<BaseNodeData<UserInputNodeData>>) => void
}>

const StartPropertyPanel = ({ id, data, updateData }: StartNodePropertyPanelProps) => {
    const { token } = theme.useToken()

    const [userInputs, setUserInputs] = useState<NodeIOData[]>(data.nodeConfig.userInputs)
    const [editingVar, setEditingVar] = useState<NodeIOData | null>(null)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    // ===== 用户输入变量操作 =====
    const handleAddVariable = () => {
        const newVar: NodeIOData = {
            type: 1,
            name: `var_${userInputs.length + 1}`,
            label: '新变量',
            required: false,
        }

        const newConfig = [...userInputs, newVar]
        setUserInputs(newConfig)
        updateData({ nodeConfig: { userInputs: newConfig }, nodeOutput: newConfig })
    }

    const handleDeleteVariable = (index: number) => {
        const newConfig = userInputs.filter((_, i) => i !== index)
        setUserInputs(newConfig)
        updateData({ nodeConfig: { userInputs: newConfig }, nodeOutput: newConfig })
    }

    const openEditDialog = (index: number) => {
        setEditingVar({ ...userInputs[index] })
        setEditingIndex(index)
    }

    const saveEdit = () => {
        if (editingIndex === null || !editingVar) return

        const newConfig = userInputs.map((v, i) =>
            i === editingIndex ? editingVar : v,
        )

        setUserInputs(newConfig)
        updateData({ nodeConfig: { userInputs: newConfig }, nodeOutput: newConfig })

        setEditingVar(null)
        setEditingIndex(null)
    }

    if (!userInputs) {
        return <UnavailableNodePropertyPanel />
    }

    return (
        <Space orientation="vertical" size="large" style={{ padding: 16, width: '100%' }}>
            {/* ===== 唯一标识符 ===== */}
            <Card size="small" title={<Typography.Text type="secondary" style={{ fontSize: 12 }}>
                唯一标识符
            </Typography.Text>}>
                <Input
                    value={id}
                    readOnly
                    style={{ marginTop: 8 }}
                />
            </Card>

            <Card title={<Typography.Text type="secondary" style={{ fontSize: 12 }}>
                输入数据
            </Typography.Text>} size='small'>
                {userInputs.length > 0 ? (
                    userInputs.map((item, index) => {
                        return <>
                            <div className=' justify-between w-full flex items-center mx-1'>
                                <Typography.Text onClick={() => openEditDialog(index)} className='cursor-pointer' style={{ color: token.colorPrimary }}>{item.name}</Typography.Text>
                                <Popconfirm
                                    key="delete"
                                    title="确认删除该变量？"
                                    onConfirm={(e) => {
                                        e?.stopPropagation()
                                        handleDeleteVariable(index)
                                    }}
                                    onCancel={(e) => e?.stopPropagation()}
                                    cancelButtonProps={{
                                        type: 'text',
                                    }}
                                    okButtonProps={{
                                        type: 'text',
                                        danger: true
                                    }}

                                >
                                    <Button
                                        danger
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Popconfirm>

                            </div>
                        </>
                    })
                ) : (
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                        暂无输入变量
                    </Typography.Text>
                )}

                <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    onClick={handleAddVariable}
                    style={{ marginTop: 8 }}
                >
                    添加变量
                </Button>
            </Card>



            {/* ===== 编辑变量弹窗 ===== */}
            <Modal
                title="编辑变量"
                open={!!editingVar}
                onCancel={() => setEditingVar(null)}
                onOk={saveEdit}
                okText="保存"
                cancelText="取消"
            >
                {editingVar && (
                    <Form layout="vertical">
                        <Form.Item label="变量标签">
                            <Input
                                value={editingVar.label}
                                onChange={(e) =>
                                    setEditingVar({ ...editingVar, label: e.target.value })
                                }
                            />
                        </Form.Item>

                        <Form.Item label="变量名称">
                            <Input
                                value={editingVar.name}
                                onChange={(e) =>
                                    setEditingVar({ ...editingVar, name: e.target.value })
                                }
                            />
                        </Form.Item>

                        <Form.Item label="变量类型">
                            <Select
                                value={editingVar.type}
                                onChange={(value) =>
                                    setEditingVar({ ...editingVar, type: value })
                                }
                                options={InputTypeOptions}
                            />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </Space>
    )
}

export default StartPropertyPanel
