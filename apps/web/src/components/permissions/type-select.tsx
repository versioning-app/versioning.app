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
import { PermissionEntry, TYPES, TYPE_MAP } from '@/types/permissions';

type TypeSelectProps = {
  entry: PermissionEntry;
  onUpdate: (updates: Partial<PermissionEntry>) => void;
};

export default function TypeSelect({ entry, onUpdate }: TypeSelectProps) {
  return (
    <div className="mt-6">
      <Label className="text-sm font-medium text-muted-foreground flex items-center">
        Type <span className="text-red-500 ml-1">*</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-4 h-4 ml-1 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Select the type of resource you are evaluating permissions for.
                This is crucial for accurate permission evaluation as different
                types may have different access rules.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <p className="text-sm text-muted-foreground mt-1 mb-2">
        Choose the type of resource to ensure accurate permission evaluation.
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
        {TYPES.map((t) => {
          const { label, icon: Icon } = TYPE_MAP[t];
          return (
            <Badge
              key={t}
              variant={entry.type === t ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/20 transition-colors duration-200"
              onClick={() => onUpdate({ type: entry.type === t ? null : t })}
            >
              <Icon className="w-4 h-4 mr-1" />
              {label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
