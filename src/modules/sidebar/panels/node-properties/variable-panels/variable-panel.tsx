import { produce } from 'immer'
import { useEffect, useState } from 'react'
import {
  BuilderNode,
  GetInputType,
  type BuilderNodeType,
  type NodeParamRefData,
} from '~/modules/nodes/types'
import { useNodePathPreOutputData } from '~/modules/flow-builder/hooks/use-node-path'

import {
  Alert,
  Card,
  Space,
  Tag,
  Tooltip,
  Typography,
  theme,
} from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

type NodeVariablePanelProps = Readonly<{
  id: string
  type: BuilderNodeType
  data: any
}>

const NodeVariablePropertiesPanel = ({ id, type, data }: NodeVariablePanelProps) => {
  const { token } = theme.useToken()

  const nodeData: any = produce(data, () => {})
  const preVariable = useNodePathPreOutputData(id)

  const [refInputs, setRefInputs] = useState<NodeParamRefData[]>([])

  useEffect(() => {
    setRefInputs(data.inputConfig.refInputs)
  }, [data.inputConfig.refInputs])

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%', padding: 16 }}>
      {/* ===== 提示信息 ===== */}
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        title={"变量使用"}
        description={
          <Typography.Text style={{ fontSize: 12 }}>
            在编辑节点属性时，可通过{' '}
            <Typography.Text code>{'{变量名}'}</Typography.Text>{' '}
            来引用各输入节点的变量。
          </Typography.Text>
        }
      />

      {/* ===== 上游节点变量 ===== */}
      <div>
        <Typography.Title level={5} style={{ marginBottom: 8 }}>
          可用变量
        </Typography.Title>

        <Card
          size="small"
          styles={{ body: { padding: 12 } }}
          variant='borderless'
        >
          {preVariable && preVariable.length > 0 ? (
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              {preVariable.map((item: any) => (
                <Card
                  key={item.nodeId}
                  size="small"
                  styles={{ body: { padding: 12 } }}
                >
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 12 }}
                  >
                    来自节点：{item.nodeId}
                  </Typography.Text>

                  <div style={{ marginTop: 8 }}>
                    <Space wrap size={[8, 8]}>
                      {item.data.map((v: any, index: number) => (
                        <Tooltip
                          key={`${item.nodeId}-${v.name}-${index}`}
                          title={`${v.label} - ${GetInputType(v.type).label} 类型`}
                        >
                          <Tag
                            color="blue"
                            style={{ cursor: 'pointer' }}
                          >
                            {v.name}
                          </Tag>
                        </Tooltip>
                      ))}
                    </Space>
                  </div>
                </Card>
              ))}
            </Space>
          ) : (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              暂无可用变量
            </Typography.Text>
          )}
        </Card>
      </div>

      {/* ===== 引用输入变量 ===== */}
      {type !== 'userInput' && (
        <div>
          <Typography.Title level={5} style={{ marginBottom: 8 }}>
            引用节点变量
          </Typography.Title>

          <Card
            size="small"
            styles={{ body: { padding: 12 } }}
          >
            {refInputs && refInputs.length > 0 ? (
              <Space wrap size={[8, 8]}>
                {refInputs.map((item: any) => (
                  <Tooltip
                    key={`${item.nodeId}-${item.nodeParamName}`}
                    title={`来自节点：${item.nodeId}`}
                  >
                    <Tag
                    color='blue'
                      style={{ cursor: 'pointer', }}
                    >
                                              {`{${item.nodeParamName}}`}

                    </Tag>
                  </Tooltip>
                ))}
              </Space>
            ) : (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                暂无可用变量
              </Typography.Text>
            )}
          </Card>
        </div>
      )}

      {/* ===== 输出变量 ===== */}
      {type !== BuilderNode.END && (
        <div>
          <Typography.Title level={5} style={{ marginBottom: 8 }}>
            输出变量
          </Typography.Title>

          <Card
            size="small"
            styles={{ body: { padding: 12 } }}
          >
            {nodeData.nodeOutput.length > 0 ? (
              <Space orientation="vertical" size="small" style={{ width: '100%' }}>
                {nodeData.nodeOutput.map((ref: any) => (
                  <div
                    key={ref.id + ref.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 8,
                      borderRadius: token.borderRadius,
                    }}
                  >
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 12 }}
                    >
                      {ref.label}
                    </Typography.Text>
                    <Typography.Text style={{ color: token.colorPrimary }}>
                      {ref.name}
                    </Typography.Text>
                  </div>
                ))}
              </Space>
            ) : (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                该节点无输出变量
              </Typography.Text>
            )}
          </Card>
        </div>
      )}
    </Space>
  )
}

export default NodeVariablePropertiesPanel
