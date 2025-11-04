import { TextArea } from "@radix-ui/themes";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDebounce } from "~/modules/flow-builder/hooks/useDebounce";
import { InputTypeEnum, type InputType, type NodeIOData, type NodeParamRefData } from "~/modules/nodes/types";

interface NodeVariables {
  nodeId: string;
  data: NodeIOData[];
}

export default function VariableInput({
  value,
  onChange,
  onRefValueChange,
  variables = [],
  row = 3,
  type = 'none',

  placeholder = "输入文本，输入 { 选择变量，或按 Ctrl+Space 手动触发"
}: {
  value: string;
  onChange: (v: string) => void;
  onRefValueChange: (refValues: NodeParamRefData[]) => void
  row: number;
  type: InputType,
  placeholder: string,
  variables: { nodeId: string, data: NodeIOData[] }[]

}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 使用防抖减少频繁更新
  const debouncedValue = useDebounce(value, 300);

  // 优化：使用稳定的引用或深度比较
  let filteredTypeVariables = variables;
  let typeValue = -1
  if (type === 'text') {
    typeValue = InputTypeEnum.TEXT // 1
  }
  if (type === 'number') {
    typeValue = InputTypeEnum.NUMBER // 2
  }
  if (type === 'boolean') {
    typeValue = InputTypeEnum.BOOLEAN // 3
  }
  if (typeValue !== -1) {
    // 过滤掉不匹配的类型
    filteredTypeVariables = variables
      .map((group: any) => ({
        ...group,
        data: group.data.filter((v: any) => v.type === typeValue),
      }))
      // 去掉 data 为空的分组
      .filter((group: any) => group.data.length > 0);
  }

  // ===== 处理变量数据结构 - 添加深度比较 =====
  const flatVariables = useMemo(() => {
    if (!filteredTypeVariables || !Array.isArray(filteredTypeVariables)) return [];

    return filteredTypeVariables.flatMap((node: NodeVariables) =>
      node.data.map((item: NodeIOData) => ({
        ...item,
        nodeId: node.nodeId,
        displayName: `${item.label} (${node.nodeId})`,
        fullPath: `${node.nodeId}.${item.name}`
      }))
    );
  }, [filteredTypeVariables]); // 依赖variablesData，但希望useNodePathPreOutputData返回稳定引用

  // ===== 过滤变量列表 - 添加搜索条件记忆 =====
  const filteredVariables = useMemo(() => {
    if (!searchTerm) return flatVariables;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return flatVariables.filter(variable =>
      variable.label.toLowerCase().includes(lowerSearchTerm) ||
      variable.name.toLowerCase().includes(lowerSearchTerm) ||
      variable.nodeId.toLowerCase().includes(lowerSearchTerm)
    );
  }, [flatVariables, searchTerm]);

  // ===== 更新节点引用的变量 - 使用useCallback和防抖值 =====
  const updateNodeRefVariable = useCallback(() => {
    // 正则表达式匹配 {nodeId.variableName} 格式的变量
    const variableRegex = /\{([^{}]+)\.([^{}]+)\}/g;

    // 存储提取出的变量引用
    const refInputs: NodeParamRefData[] = [];

    let match;
    // 遍历所有匹配的变量
    while ((match = variableRegex.exec(debouncedValue)) !== null) {
      const matchedNodeId = match[1];
      const variableName = match[2];

      // 检查这个变量是否在可用的变量列表中
      const isValidVariable = flatVariables.some(
        variable => variable.nodeId === matchedNodeId && variable.name === variableName
      );

      if (isValidVariable) {
        // 避免重复添加相同的变量引用
        const isDuplicate = refInputs.some(
          ref => ref.nodeId === matchedNodeId && ref.nodeParamName === variableName
        );

        if (!isDuplicate) {
          refInputs.push({
            nodeId: matchedNodeId,
            nodeParamName: variableName,
            name: variableName,
          });
        }
      }
    }
    onRefValueChange(refInputs)

  }, [debouncedValue]);

  // ===== 只在防抖值变化时更新引用 =====
  useEffect(() => {
    updateNodeRefVariable();
  }, [updateNodeRefVariable]);

  // ===== 智能检测触发 - 优化性能 =====
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart;
    setCursorPos(pos);
    onChange(val);

    // 检测是否输入了 { 或者正在输入变量
    const textBeforeCursor = val.slice(0, pos);
    const lastOpenBrace = textBeforeCursor.lastIndexOf("{");

    if (lastOpenBrace !== -1) {
      // 检查 { 后面是否有 }，如果没有则显示下拉框
      const textAfterBrace = textBeforeCursor.slice(lastOpenBrace);
      const hasClosingBrace = textAfterBrace.includes("}");

      if (!hasClosingBrace) {
        const currentSearch = textBeforeCursor.slice(lastOpenBrace + 1);
        setSearchTerm(currentSearch);
        setShowDropdown(true);
        setHighlightIndex(0);
        updateDropdownPosition(pos);
        return;
      }
    }

    // 如果没有未闭合的 {，隐藏下拉框
    if (showDropdown) {
      setShowDropdown(false);
      setSearchTerm("");
    }
  }, [onChange, showDropdown]);

  // ===== 键盘导航优化 =====
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showDropdown && filteredVariables.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightIndex(prev =>
            prev < filteredVariables.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightIndex(prev =>
            prev > 0 ? prev - 1 : filteredVariables.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredVariables[highlightIndex]) {
            insertVariable(filteredVariables[highlightIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setShowDropdown(false);
          inputRef.current?.focus();
          break;
        case "Tab":
          if (filteredVariables[highlightIndex]) {
            e.preventDefault();
            insertVariable(filteredVariables[highlightIndex]);
          }
          break;
      }
    } else if (e.key === " " && e.ctrlKey) {
      // Ctrl+Space 手动触发
      e.preventDefault();
      setShowDropdown(true);
      setSearchTerm("");
      setHighlightIndex(0);
      updateDropdownPosition(cursorPos);
    }
  }, [showDropdown, filteredVariables, highlightIndex, cursorPos]);

  // ===== 插入变量优化 =====
  const insertVariable = useCallback((variable: typeof flatVariables[0]) => {
    if (!inputRef.current) return;

    const textBeforeCursor = value.slice(0, cursorPos);
    const lastOpenBrace = textBeforeCursor.lastIndexOf("{");

    let insertPosition = cursorPos;
    let newValue = value;

    if (lastOpenBrace !== -1) {
      // 替换从 { 到当前位置的内容
      const beforeBrace = value.slice(0, lastOpenBrace);
      const afterCursor = value.slice(cursorPos);
      newValue = beforeBrace + "{" + variable.fullPath + "}" + afterCursor;
      insertPosition = beforeBrace.length + variable.fullPath.length + 2;
    } else {
      // 直接插入
      const before = value.slice(0, cursorPos);
      const after = value.slice(cursorPos);
      newValue = before + "{" + variable.fullPath + "}" + after;
      insertPosition = before.length + variable.fullPath.length + 2;
    }

    onChange(newValue);
    setShowDropdown(false);
    setSearchTerm("");

    // 下一帧设置光标位置
    setTimeout(() => {
      inputRef.current?.setSelectionRange(insertPosition, insertPosition);
      inputRef.current?.focus();
    }, 0);
  }, [value, cursorPos, onChange]);

  // ===== 位置计算优化 =====
  const updateDropdownPosition = useCallback((pos: number) => {
    if (!inputRef.current || !mirrorRef.current) return;

    const textBeforeCursor = value.slice(0, pos);
    const mirror = mirrorRef.current;

    mirror.textContent = textBeforeCursor || " ";
    const span = document.createElement("span");
    span.textContent = "\u200b";
    mirror.appendChild(span);

    const rect = span.getBoundingClientRect();
    const inputRect = inputRef.current.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dropdownHeight = Math.min(filteredVariables.length * 32 + 60, 200);
    const dropdownWidth = 264;

    let top = rect.bottom - inputRect.top;
    let left = rect.left - inputRect.left;

    const verticalOffset = 12;
    top += verticalOffset;

    if (top + dropdownHeight > viewportHeight - inputRect.top) {
      top = rect.top - inputRect.top - dropdownHeight - verticalOffset;
    }

    if (left + dropdownWidth > viewportWidth - inputRect.left) {
      left = Math.max(8, inputRect.width - dropdownWidth - 8);
    }

    top = Math.max(8, top);
    left = Math.max(8, left);

    setDropdownPosition({ top, left });
  }, [value, filteredVariables.length]);

  // ===== 点击外部关闭优化 =====
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===== 滚动时重新定位 =====
  useEffect(() => {
    if (showDropdown) {
      updateDropdownPosition(cursorPos);
    }
  }, [showDropdown, filteredVariables.length, cursorPos, updateDropdownPosition]);

  return (
    <div className="relative w-full">
      {/* ===== 文本输入框 ===== */}
      <div className="relative">
        <TextArea
          ref={inputRef}
          className="w-full  !p-2 !rounded-lg !text-gray-300 bg-gray-800 border border-gray-600 text-sm shadow-sm outline-none duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          radius="large"
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onClick={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setCursorPos(target.selectionStart);
          }}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement;
            setCursorPos(target.selectionStart);
          }}
          rows={row}
          placeholder={placeholder}
        />
        <style>{`
          textarea::placeholder {
            color: #6b7280 !important;
            font-size: 0.875rem !important;
          }
        `}</style>
      </div>

      {/* ===== 镜像元素（用于位置计算） ===== */}
      <div
        ref={mirrorRef}
        className="absolute top-0 left-0 invisible whitespace-pre-wrap break-words pointer-events-none opacity-0"
        style={{
          fontSize: "14px",
          fontFamily: "inherit",
          lineHeight: "1.5",
          padding: "0.5rem",
          width: "100%",
          minHeight: "100%",
          border: "1px solid transparent",
          boxSizing: "border-box",
        }}
      />

      {/* ===== 变量下拉列表 ===== */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 w-64 max-h-60 overflow-auto backdrop-blur-sm"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {/* 搜索状态显示 */}
          {searchTerm && (
            <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-700 bg-gray-750">
              搜索: "{searchTerm}"
              <span className="float-right text-gray-300">
                {filteredVariables.length} 个变量
              </span>
            </div>
          )}

          {/* 变量列表 */}
          {filteredVariables.length > 0 ? (
            filteredVariables.map((variable, index) => (
              <div
                key={`${variable.nodeId}-${variable.name}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertVariable(variable);
                }}
                onMouseEnter={() => setHighlightIndex(index)}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors duration-150 ${highlightIndex === index
                  ? "bg-blue-600 text-white"
                  : "text-gray-200 hover:bg-gray-700"
                  }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{variable.label}</span>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{variable.nodeId}</span>
                    <span>{variable.name}</span>
                  </div>
                </div>
                {highlightIndex === index && (
                  <div className="text-xs text-blue-200 mt-1">
                    将插入: {"{"}{variable.fullPath}{"}"}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-gray-400 text-center">
              未找到匹配的变量
            </div>
          )}

          {/* 快捷键提示 */}
          <div className="px-3 py-2 text-xs text-gray-400 border-t border-gray-700 bg-gray-750">
            ↑↓ 导航 • Enter/Tab 选择 • Esc 关闭
          </div>
        </div>
      )}
    </div>
  );
}