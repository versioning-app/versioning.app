'use client';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
} from 'reactflow';

import { Edge, Node as ReactFlowNode } from 'reactflow';

import 'reactflow/dist/style.css';

import { nodeTypes } from '@/components/dashboard/flow/elk-nodes';
import useLayoutNodes from '@/components/dashboard/flow/use-layout-nodes';
import { cn } from '@/lib/utils';

const panOnDrag = [1, 2];

function convertToNodesAndEdges(releaseSteps: any[]): {
  nodes: ReactFlowNode[];
  edges: Edge[];
} {
  const nodes: ReactFlowNode[] = [];
  const edges: Edge[] = [];
  const nodeMap: { [key: string]: ReactFlowNode } = {};

  // Create nodes
  releaseSteps.forEach((step) => {
    const node: ReactFlowNode = {
      id: step.release_strategy_step_id,
      data: {
        ...step,
        sourceHandles: [],
        targetHandles: [],
      },
      position: { x: 0, y: 0 }, // You can adjust the position as needed
      type: step.action,
    };
    nodes.push(node);
    nodeMap[step.release_strategy_step_id] = node;
  });

  // Create edges and update node handles
  releaseSteps.forEach((step) => {
    if (step.parent_id) {
      const edgeCount =
        edges.filter(
          (edge) =>
            edge.source === step.parent_id &&
            edge.target === step.release_strategy_step_id,
        ).length + 1;

      const edge: Edge = {
        id: `e${step.parent_id}-${step.release_strategy_step_id}-${edgeCount}`,
        source: step.parent_id,
        target: step.release_strategy_step_id,
      };
      edges.push(edge);

      // Update sourceHandles and targetHandles
      const sourceNode = nodeMap[step.parent_id];
      const targetNode = nodeMap[step.release_strategy_step_id];

      if (sourceNode) {
        sourceNode.data.sourceHandles.push({
          id: `${step.parent_id}-s-${step.release_strategy_step_id}-${edgeCount}`,
        });
      }
      if (targetNode) {
        targetNode.data.targetHandles.push({
          id: `${step.parent_id}-t-${step.release_strategy_step_id}-${edgeCount}`,
        });
      }
    }
  });

  return { nodes, edges };
}

export function ReleaseOverview({ data }: { data: any }) {
  const { nodes: initNodes, edges: initEdges } = convertToNodesAndEdges(data);

  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, , onEdgesChange] = useEdgesState(initEdges);

  useLayoutNodes();

  const nodesInitialized = useNodesInitialized();

  return (
    <ReactFlow
      className={cn({
        'opacity-0': !nodesInitialized,
        'opacity-100': nodesInitialized,
        'transition-all duration-500 ease-in-out': true,
        // 'opacity-0': !nodesInitialized,
      })}
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      fitViewOptions={{
        // maxZoom: 0.5,
        duration: 0.5,
        // minZoom: 0.5,
        nodes: nodes,
      }}
      // fitView
      panOnScroll
      // selectionOnDrag
      panOnDrag={panOnDrag}
      // selectionMode={SelectionMode}
      nodeTypes={nodeTypes}
      proOptions={{
        hideAttribution: true,
      }}
    >
      <Background />
      <Controls />
      <MiniMap
        pannable={true}
        zoomable={true}
        className="md:hidden lg:block"
        nodeColor={nodeColor}
      />
    </ReactFlow>
  );
}

function nodeColor(node: any) {
  if (node?.data?.release_step_status === 'complete') {
    return '#15803d';
  }
  if (
    node?.data?.release_step_status === 'pending' ||
    node?.data?.release_step_status === 'in_progress'
  ) {
    return '#EA580C';
  }

  if (node.data?.release_step_status === 'failed') {
    return '#B91C1C';
  }

  return '';
}
