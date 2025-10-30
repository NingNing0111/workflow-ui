export default function UnavailableNodePropertyPanel() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
      <div className="size-12 flex items-center justify-center rounded-full bg-dark-300">
        <div className="i-mynaui:info-triangle size-6 text-white" />
      </div>

      <div className="mt-4 text-balance font-medium">
        不可用的属性
      </div>

      <div className="mt-1 w-2.5/3 text-xs text-light-50/40 font-medium leading-normal">
        该节点没有可用属性，或者该节点未被选中。
      </div>

      <div className="mt-8 w-full text-xs text-light-50/40 font-medium italic">
        选择另一个节点以查看其属性。
      </div>
    </div>
  )
}
