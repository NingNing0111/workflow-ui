export default function IntroductionPropertyPanel() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
      <div className="size-12 flex items-center justify-center rounded-full bg-teal-800">
        <div className="i-mynaui:cog-one size-6 text-white" />
      </div>

      <div className="mt-4 text-balance font-medium">
        节点属性
      </div>

      <div className="mt-1 w-2.5/3 text-xs text-light-50/40 font-medium leading-normal">
        在这里您可以查看和编辑所选节点的属性。
      </div>

      <div className="mt-8 w-full text-xs text-light-50/40 font-medium italic">
        从顶部列表中选择一个节点，即可查看其属性。
      </div>
    </div>
  )
}
