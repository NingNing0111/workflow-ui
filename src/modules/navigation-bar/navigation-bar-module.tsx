import { toast } from 'sonner'
import { Layout, Avatar, Typography, Button, Space, Flex, Divider } from 'antd'
import {
  CheckCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons'
import { useFlowValidator } from '~/modules/flow-builder/hooks/use-flow-validator'
import { useApplicationState } from '~/stores/application-state'
import { useReactFlow } from '@xyflow/react'
import { runWorkflow, updateWorkflow } from '~/api/workflow'
import ThemeTraggle from '~/modules/navigation-bar/components/theme-traggle'
export function NavigationBarModule() {

  const { getNodes, getEdges } = useReactFlow()
  const [isMobileView] = useApplicationState(s => [s.view.mobile])

  const [isValidating, validateFlow] = useFlowValidator((isValid) => {
    if (isValid) {
      toast.success('流程校验通过', { description: '您现在可以进行下一步了。', dismissible: true })
    } else {
      toast.error('流程校验异常', { description: '请检查流程是否完整，且是否存在孤立节点。' })
    }
  })

  const submitApp = () => {
    const nodes = getNodes();
    const edges = getEdges();
    updateWorkflow({
      workflowId: import.meta.env.VITE_APP_TEXT_WORKFLOW_ID,
      nodes: nodes,
      edges: edges
    })
  }

  const runApp = () => {
    runWorkflow({
      workflowId: import.meta.env.VITE_APP_TEXT_WORKFLOW_ID,
      inputs: [{
        "name": "userInput",
        "content": {
          "label": "用户输入",
          "value": "介绍下Rust这门语言，在哪些领域有优势",
          "type": 1
        }
      }, {
        "name": "chatModel",
        "content": {
          "label": "对话模型",
          "value": "qwen-plus",
          "type": 1
        }
      }]
    }, {
      onMessage(event) {
        console.log(event.data);
      },
    })
  }

  return (
    <div className='px-3'>
      <Flex align="center" justify="space-between" gap={24}>
        {/* 左侧：Logo + 标题 */}
        <Flex align="center" gap={12} className='py-1'>
          <Avatar size={32}>
            AI
          </Avatar>
          {/* <Flex vertical gap={2}>
            <div className='flex flex-col items-center  w-full '>
              <Title level={5} style={{ margin: 0 }}>
                AI Workflow
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                create by HuiCe
              </Text>
            </div>

          </Flex> */}
        </Flex>

        {/* 右侧：操作按钮 */}
        {!isMobileView && (
          <Space>
            <Button
              loading={isValidating}
              icon={!isValidating && <CheckCircleOutlined />}
              onClick={validateFlow}
            >
              {isValidating ? '检查中' : '检查工作流'}
            </Button>
            <Button
              icon={<RocketOutlined />}
              onClick={() => {
                submitApp()
              }}
            >
              发布
            </Button>

            <ThemeTraggle />
          </Space>
        )}
      </Flex>
    </div>
  )
}
