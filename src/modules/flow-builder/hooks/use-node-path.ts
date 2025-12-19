import {  useStore } from "@xyflow/react"
import { useMemo } from "react"
import { getNodeDetail } from "~/modules/nodes/utils"


/**
 * 获取从开始节点到目标节点的所有路径（每条路径包含所有节点data）
 * @param targetNodeId 目标节点ID
 * @returns Array<Array<NodeData>> 多条路径，每条路径是节点数据数组
 */
export const useAllPathsToNode = (targetNodeId: string) => {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);

    const allPaths = useMemo(() => {
        if (!nodes.length || !targetNodeId) return [];

        // 找到开始节点
        const startNode = nodes.find((n) => n.type === "start");
        if (!startNode) return [];

        const resultPaths: any[] = [];

        // 队列保存 [当前节点ID, 路径数组]
        const queue: [string, any[]][] = [[startNode.id, []]];
        // BFS找全路径
        while (queue.length > 0) {
            const [currentNodeId, currentPath] = queue.shift()!;
            const currentNode = nodes.find((n) => n.id === currentNodeId);
            if (!currentNode) continue;

            // 当前路径 + 当前节点
            const newPath = [
                ...currentPath,
                {
                    ...currentNode.data,
                    id: currentNode.id,
                    type: currentNode.type,
                    title: getNodeDetail(currentNode.type as any).title,
                },
            ];

            // ✅ 如果找到目标节点
            if (currentNodeId === targetNodeId) {
                resultPaths.push(newPath);
                continue;
            }

            // 获取从当前节点出发的所有边
            const outgoingEdges = edges.filter((e) => e.source === currentNodeId);

            for (const edge of outgoingEdges) {
                // 防止路径中出现环
                if (!newPath.find((n) => n.id === edge.target)) {
                    queue.push([edge.target, newPath]);
                }
            }
        }

        return resultPaths;
    }, [nodes, edges, targetNodeId]);

    return allPaths;
};


/**
 * 获取从开始节点 到 目标节点的所有数据
 * @param targetNodeId 节点ID
 */
export const useNodePathPreOutputData = (targetNodeId: string) => {

    const pathAllData = useAllPathsToNode(targetNodeId);
    const mergedPathData = useMemo(() => {
        if (!pathAllData.length) return [];

        // 展平所有路径并按节点id去重
        const uniqueMap = new Map<string, any>();

        pathAllData.flat().forEach((node) => {
            uniqueMap.set(node.id, node);
        });

        return Array.from(uniqueMap.values());
    }, [pathAllData]);
    // 将所有路径数据合并 并根据id 去重

    const validNodes = mergedPathData.filter(
        (item: any) => item.id !== targetNodeId
    );
    let result: any = [];
    for (const node of validNodes) {
        var newResult = node.nodeOutput.map((item: any) => {
            return {
                ...item,
                id: node.id
            }
        })

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