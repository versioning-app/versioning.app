import { Node } from 'reactflow';

export type ElkNodeData = {
  sourceHandles: { id: string }[];
  targetHandles: { id: string }[];
} & Record<string, any>;

export type ElkNode = Node<ElkNodeData, 'elk'>;
