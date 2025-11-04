import { useReactFlow } from "@xyflow/react"
import { useMemo } from "react"
import { BuilderNode } from "~/modules/nodes/types"
import { getNodeDetail } from "~/modules/nodes/utils"


const getPathAllData = (targetNodeId: string) => {
    const { getNodes, getEdges } = useReactFlow()
    const pathData = useMemo(() => {

        const nodes = getNodes();
        const edges = getEdges();

        if (!nodes.length || !targetNodeId) return []

        // 找开始节点
        const startNode = nodes.find(n => n.type === 'start');
        if (!startNode) return []

        // 结果数组
        let result: any[] = []
        let found = false;
        // 记录存放已访问过的节点
        const visited = new Set<string>();

        // DFS
        const dfs = (currentNodeId: string, currentPath: any[]) => {
            if (found) return;
            // 设置当前节点 已访问过
            visited.add(currentNodeId);
            const node = nodes.find(n => n.id === currentNodeId);
            if (!node) return;
            const newPath = [...currentPath, { ...node.data, id: currentNodeId, title: getNodeDetail(node.type).title, type: node.type }];

            // 如果当前节点就是目标节点 则退出
            if (currentNodeId == targetNodeId) {
                result = newPath;
                found = true;
                return;
            }


            // 遍历下一个可访问节点
            const nextEdges = edges.filter(e => e.source === currentNodeId)
            for (const edge of nextEdges) {
                if (!visited.has(edge.target)) {
                    dfs(edge.target, newPath)
                }
            }
        }

        dfs(startNode.id, [])
        return result;

    }, [targetNodeId, getEdges, getNodes])

    return pathData;
}
/**
 * 获取从开始节点 到 目标节点的所有数据
 * @param targetNodeId 节点ID
 */
export const useNodePathPreOutputData = (targetNodeId: string) => {

    const pathAllData = getPathAllData(targetNodeId);

    const validNodes = pathAllData.filter(
        (item) => item.id !== targetNodeId
    );
    let result: any = [];
    for (const node of validNodes) {
        var newResult = []
        if (node.type === BuilderNode.USER_INPUT) {
            newResult = node.inputConfig.userInputs.map((item: any) => {
                return {
                    ...item,
                    id: node.id
                }
            })
        } else {
            newResult = node.nodeOutput
        }
        result = [...result, ...newResult]
    }
    const groupedData = Object.values(
        result.reduce((acc: any, item: any) => {
            if (!acc[item.id]) {
                acc[item.id] = { nodeId: item.id, data: [] }
            }
            acc[item.id].data.push({
                type: item.type,
                name: item.name,
                label: item.label,
                required: item.required,
                id: item.id,
            })
            return acc
        }, {})
    )
    
    return groupedData
}