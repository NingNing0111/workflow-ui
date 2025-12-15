import { toast } from 'sonner'

import { Switch } from '~@/components/generics/switch-case'
import { Whenever } from '~@/components/generics/whenever'
import { cn } from '~@/utils/cn'
import { useFlowValidator } from '~/modules/flow-builder/hooks/use-flow-validator'

import { useApplicationState } from '~/stores/application-state'
import { useReactFlow } from '@xyflow/react'
import { runWorkflow, updateWorkflow } from '~/api/workflow'

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
    // updateWorkflow({
    //   workflowId: import.meta.env.VITE_APP_TEXT_WORKFLOW_ID,
    //   nodes: nodes,
    //   edges: edges
    // })

    console.log(nodes);
    console.log(edges);
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
      },{
        "name": "chatModel",
        "content": {
          "label" :"对话模型",
          "value": "qwen-plus",
          "type": 1
        }
      }]
    },{
      onMessage(event) {
        console.log(event.data);
      },
    })
  }

  return (
    <div className="relative shrink-0 bg-dark-700 px-1.5 py-2">
      <div className="absolute inset-0">
        <div className="absolute h-full w-4/12 from-teal-900/20 to-transparent bg-gradient-to-r <md:(from-teal-900/50)" />
      </div>

      <div className="relative flex items-stretch justify-between gap-x-8">
        <div className="flex items-center py-0.5 pl-2">
          <div className="size-8 flex shrink-0 select-none items-center justify-center rounded-lg bg-teal-600 text-sm font-bold leading-none">
            <span className="translate-y-px">
              WK
            </span>
          </div>

          <div className="ml-3 h-full flex flex-col select-none justify-center gap-y-1 leading-none">
            <div className="text-sm font-medium leading-none <md:(text-xs)">
              AI Workflow 编排器
            </div>

            <div className="text-xs text-light-50/60 leading-none">
              create by HuiCe
            </div>
          </div>
        </div>

        <Whenever condition={isMobileView} not>
          <div className="flex items-center justify-end gap-x-2">
            <button
              type="button"
              className={cn(
                'h-full flex items-center justify-center outline-none gap-x-2 border border-dark-300 rounded-lg bg-dark-300/50 px-3 text-sm transition active:(bg-dark-400) hover:(bg-dark-200)',
                isValidating && 'cursor-not-allowed op-50 pointer-events-none',
              )}
              onClick={() => validateFlow()}
            >
              <Switch match={isValidating}>
                <Switch.Case value>
                  <div className="i-svg-spinners:180-ring size-5" />
                </Switch.Case>
                <Switch.Case value={false}>
                  <div className="i-mynaui:check-circle size-5" />
                </Switch.Case>
              </Switch>
              <span className="pr-0.5">
                {isValidating ? '检查中' : '检查工作流'}
              </span>
            </button>

            <button
              type="button"
              className={cn(
                'h-full flex items-center justify-center gap-x-2 border border-dark-300 rounded-lg bg-dark-300/50 px-3 text-sm font-medium transition',
                'hover:(bg-dark-200) active:(bg-dark-400)',
              )}
              onClick={() => {
                submitApp();
                toast.success('发布成功', { description: '工作流已成功发布！', dismissible: true })
              }}
            >
              <div className="i-mynaui:rocket size-5" />
              <span>发布</span>
            </button>

            <button
              type="button"
              className={cn(
                'h-full flex items-center justify-center gap-x-2 border border-dark-300 rounded-lg bg-dark-300/50 px-3 text-sm font-medium transition',
                'hover:(bg-dark-200) active:(bg-dark-400)',
              )}

              onClick={()=>{
                runApp();
              }}
            ><div className="i-mynaui:code-octagon size-5" /><span>调试</span></button>
          </div>
        </Whenever>
      </div>
    </div>
  )
}
