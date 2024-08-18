'use client';
import { Handle, NodeProps, NodeTypes, Position } from 'reactflow';

import { capitalizeFirstLetter, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DateRenderer } from '@/components/dashboard/dates';
import { Clock2Icon } from 'lucide-react';

export const Node = ({ data }: NodeProps) => {
  return (
    <div
      className={cn(
        'px-4 py-2 shadow-md rounded-lg bg-secondary border-2 border-stone-400',
      )}
    >
      <div className="flex flex-col">
        <div className="text-xl font-bold flex justify-center">
          {data.name ?? data?.action}{' '}
          <Badge
            className={cn({
              uppercase: true,
              'text-xxs': true,
              'ml-2': true,
              'text-secondary': true,
              'bg-green-600': data?.release_step_status === 'complete',
              'bg-orange-600':
                data?.release_step_status === 'pending' ||
                data?.release_step_status === 'in_progress',
              'bg-red-600': data?.release_step_status === 'failed',
              'bg-slate-500': !data?.release_step_status,
            })}
          >
            {capitalizeFirstLetter(
              data?.release_step_status ?? 'Not started',
            )?.replace('_', ' ')}
          </Badge>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {data?.release_step_finalized_at ? (
              <div className="flex">
                <div>
                  <Clock2Icon className="mr-2 w-4 h-4" />
                </div>
                <div>
                  <p>
                    Finalised{' '}
                    <DateRenderer value={data.release_step_finalized_at} />
                  </p>
                </div>
              </div>
            ) : (
              'Not yet finalised'
            )}
          </p>
        </div>
      </div>

      {!data?.__direction || data?.__direction === 'DOWN' ? (
        <>
          <Handle
            type="target"
            position={Position.Top}
            // className="w-16 !bg-teal-500"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            // className="w-16 !bg-teal-500"
          />
        </>
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Left}
            // className="w-16 !bg-teal-500"
          />
          <Handle
            type="source"
            position={Position.Right}
            // className="w-16 !bg-teal-500"
          />{' '}
        </>
      )}
    </div>
  );
};

export const ApprovalGateNode = (props: NodeProps) => {
  return <Node {...props} />;
};

export const DeploymentNode = (props: NodeProps) => {
  return <Node {...props} />;
};

export const PrepareNode = (props: NodeProps) => {
  return <Node {...props} />;
};

export const nodeTypes: NodeTypes = {
  approval_gate: ApprovalGateNode,
  deployment: DeploymentNode,
  prepare: PrepareNode,
};
