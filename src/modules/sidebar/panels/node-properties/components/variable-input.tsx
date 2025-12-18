import { TextArea } from "@radix-ui/themes";
import { Dropdown, Empty, Menu, theme, type MenuProps } from "antd";
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
  const { token } = theme.useToken()
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
    const input = inputRef.current;
    const mirror = mirrorRef.current;
    if (!input || !mirror) return;

    // 1️⃣ 复制文本
    mirror.textContent = value.slice(0, pos);

    // 2️⃣ 光标占位 span
    const cursorSpan = document.createElement('span');
    cursorSpan.textContent = '\u200b';
    mirror.appendChild(cursorSpan);

    // 3️⃣ 获取 span 的 viewport 坐标
    const spanRect = cursorSpan.getBoundingClientRect();

    // 4️⃣ 清理
    mirror.removeChild(cursorSpan);

    const dropdownWidth = 260;
    const dropdownHeight = Math.min(filteredVariables.length * 32 + 80, 260);
    const gap = 8;

    let top = spanRect.bottom + gap;
    let left = spanRect.left;

    // 5️⃣ 自动翻转（到底部不够空间）
    if (top + dropdownHeight > window.innerHeight) {
      top = spanRect.top - dropdownHeight - gap;
    }

    // 6️⃣ 右侧溢出处理
    if (left + dropdownWidth > window.innerWidth) {
      left = window.innerWidth - dropdownWidth - 8;
    }

    setDropdownPosition({
      top: Math.max(8, top),
      left: Math.max(8, left),
    });
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
    if (!showDropdown) return;
    updateDropdownPosition(cursorPos);

    const handleScroll = () => updateDropdownPosition(cursorPos);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showDropdown, cursorPos, updateDropdownPosition]);

  const menuItems: MenuProps['items'] =
    filteredVariables.length > 0
      ? filteredVariables.map((variable, index) => ({
        key: `${variable.nodeId}-${variable.name}`,
        label: (
          <div
            onMouseEnter={() => setHighlightIndex(index)}
            style={{
              padding: '4px 0',
              color: token.colorTextBase,
            }}
          >
            <div style={{ fontWeight: 500, color: token.colorText }}>
              {variable.label}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 12,
                opacity: 0.65,
                marginTop: 4,
                color: token.colorText
              }}
            >
              <span>{variable.nodeId}</span>
              <span>{variable.name}</span>
            </div>

            {highlightIndex === index && (
              <div
                style={{
                  fontSize: 12,
                  color: token.colorPrimary,
                  marginTop: 4,
                }}
              >
                将插入: {'{'}
                {variable.fullPath}
                {'}'}
              </div>
            )}
          </div>
        ),
        onMouseDown: (e: any) => {
          e.domEvent.preventDefault()
          insertVariable(variable)
        },
      }))
      : [
        {
          key: 'empty',
          disabled: true,
          label: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="未找到匹配的变量"
            />
          ),
        },
      ]
  const mirrorStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    visibility: 'hidden',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    pointerEvents: 'none',
    opacity: 0,

    fontSize: 14,
    fontFamily: 'inherit',
    lineHeight: '1.5',

    padding: '8px 12px',
    boxSizing: 'border-box',

    width: inputRef.current
      ? `${inputRef.current.clientWidth}px`
      : '100%',
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* ===== 文本输入框 ===== */}
      <TextArea
        ref={inputRef}
        value={value}
        rows={row}
        placeholder={placeholder}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          const target = e.target as HTMLTextAreaElement
          setCursorPos(target.selectionStart)
        }}
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement
          setCursorPos(target.selectionStart)
        }}
        style={{
          fontSize: 14,
          color: token.colorText,
          padding: 8,
          borderRadius: 8
        }}
      />

      {/* ===== 镜像元素（用于光标定位计算） ===== */}
      <div
        ref={mirrorRef}
        style={mirrorStyle}
      />

      {/* ===== 变量下拉列表 ===== */}
      <Dropdown
        open={showDropdown}
        trigger={[]}
        styles={{
          root: {
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: 260,
          },
        }}
        popupRender={() => (
          <div
            ref={dropdownRef}
            style={{
              background: token.colorBgElevated,
              border: `1px solid ${token.colorBorderSecondary}`,
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadowSecondary,
              overflow: 'hidden',
            }}
          >
            {/* 搜索状态 */}
            {searchTerm && (
              <div
                style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  color: token.colorTextSecondary,
                  borderBottom: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                搜索: "{searchTerm}"
                <span style={{ float: 'right' }}>
                  {filteredVariables.length} 个变量
                </span>
              </div>
            )}

            {/* 变量列表 */}
            <div style={{ maxHeight: 240, overflow: 'auto' }}>
              <Menu
                items={menuItems}
                selectable={false}
                style={{
                  background: 'transparent', // 重要：让 Menu 用容器背景
                }}
              />
            </div>

            {/* 快捷键提示 */}
            <div
              style={{
                padding: '6px 12px',
                fontSize: 12,
                color: token.colorTextSecondary,
                borderTop: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              ↑↓ 导航 • Enter / Tab 选择 • Esc 关闭
            </div>
          </div>
        )}
      />
    </div>
  );
}