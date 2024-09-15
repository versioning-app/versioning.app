import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { PermissionEntry, ACTIONS } from '@/types/permissions';

type ActionSelectProps = {
  entry: PermissionEntry;
  onUpdate: (updates: Partial<PermissionEntry>) => void;
};

export default function ActionSelect({ entry, onUpdate }: ActionSelectProps) {
  const capitalizeAction = (action: string) => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-muted-foreground flex items-center">
        Actions
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-4 h-4 ml-1 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Select one or more actions to evaluate. Actions represent the
                operations (e.g., read, create, update) you want to check
                permissions for.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <p className="text-sm text-muted-foreground">
        Select the actions you want to evaluate for this resource.
      </p>
      <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-background">
        {ACTIONS.map((action) => (
          <Badge
            key={action}
            variant={entry.actions.includes(action) ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/20 transition-colors duration-200"
            onClick={() => {
              const newActions = entry.actions.includes(action)
                ? entry.actions.filter((a) => a !== action)
                : [...entry.actions, action];
              onUpdate({ actions: newActions });
            }}
          >
            {capitalizeAction(action)}
          </Badge>
        ))}
      </div>
    </div>
  );
}
