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
  Collapse,
  Empty,
  Space,
  Tag,
  Tooltip,
  Typography,
  theme,
} from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import OutputVariableDisplay from '~/modules/sidebar/components/variable-display/output-variable-display'
import { useReactFlow } from '@xyflow/react'
import InputVariableDisplay from '~/modules/sidebar/components/variable-display/input-variable-display'

type NodeVariablePanelProps = Readonly<{
  id: string
  type: BuilderNodeType
  data: any
}>

const NodeVariablePropertiesPanel = ({ id, type, data }: NodeVariablePanelProps) => {
  const { token } = theme.useToken()
  const { getNode } = useReactFlow();

  const nodeData: any = produce(data, () => { })
  const preVariable = useNodePathPreOutputData(id)

  const [refInputs, setRefInputs] = useState<NodeParamRefData[]>([])

  useEffect(() => {
    setRefInputs(data.inputConfig.refInputs)
  }, [data.inputConfig.refInputs])

  return (
    <Space orientation="vertical" style={{ width: '100%', padding: 16 }}>
      {/* ===== 提示信息 ===== */}
        <Typography.Paragraph>
          <Typography.Text style={{ fontSize: 12 }}>
            在编辑节点属性时，可通过{' '}
            <Typography.Text code>{'{变量名}'}</Typography.Text>{' '}
            来引用各上游节点的输出变量。
          </Typography.Text>
        </Typography.Paragraph>

      {/* ===== 上游节点变量 ===== */}
      <Collapse size='small' defaultActiveKey={['canUseVariable']}>
        <Collapse.Panel header="可用变量" key="canUseVariable">
          {preVariable.length > 0 ? <div className='flex flex-col gap-2'>
            {(preVariable.map((item: any) => {
              const nodeData = getNode(item.nodeId)?.data as any;
              return (
                <div >
                  <Typography.Title type='secondary' style={{ fontSize: 12 }}>
                    {nodeData.label}
                  </Typography.Title>
                  <div className='flex gap-2 items-center'>
                    {item.data.map((v: any, index: number) => (
                      <Tooltip
                        key={`${item.nodeId}-${v.name}-${index}`}
                        title={`${v.label} - ${GetInputType(v.type).label} 类型`}
                      >
                        <InputVariableDisplay
                          name={v.name}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )
            }))}
          </div> :
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              暂无可用变量
            </Typography.Text>}
        </Collapse.Panel>

        <Collapse.Panel header="已引用的变量" key="refVariable">
          {refInputs.length > 0 ? (<div className='flex gap-2'>
            {refInputs.map((item: any) => {
              const nodeData = getNode(item.nodeId)?.data as any;
              return <InputVariableDisplay
                prefix={nodeData.label}
                name={item.name}
              />
            })}

          </div>) :
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              当前节点没有引用任何变量
            </Typography.Text>}
        </Collapse.Panel>

        {type !== BuilderNode.END && (
          <Collapse.Panel header="输出变量" key="outputVariable">
            {nodeData.nodeOutput.length > 0 ? nodeData.nodeOutput.map((ref: any) => (
              <OutputVariableDisplay name={ref.name} type={ref.type} desc={ref.label} />
            )) : <Empty description='该节点暂无输出变量' />}
          </Collapse.Panel>
        )}
      </Collapse>




    </Space>
  )
}

export default NodeVariablePropertiesPanel
