import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Star,
  FileText,
  Code,
  Lock,
} from 'lucide-react';
import { PermissionEntry, TYPE_MAP } from '@/types/permissions';
import ResourceSelect from './resource-select';
import ActionSelect from './action-select';
import TypeSelect from './type-select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PermissionEntryCardProps = {
  entry: PermissionEntry;
  index: number;
  onRemove: () => void;
  onUpdate: (
    updates: Partial<PermissionEntry>,
    triggerEvaluation: boolean,
  ) => void;
  resources: string[];
  showRemoveButton: boolean;
  evaluationResult: 'allowed' | 'denied' | 'unevaluated';
};

export function PermissionEntryCard({
  entry,
  index,
  onRemove,
  onUpdate,
  resources,
  showRemoveButton,
  evaluationResult,
}: PermissionEntryCardProps) {
  const [isResourceSelected, setIsResourceSelected] = useState(
    !!entry.resource,
  );
  const [showActions, setShowActions] = useState(false);
  const [showType, setShowType] = useState(false);

  useEffect(() => {
    if (!isResourceSelected) {
      setShowActions(false);
      setShowType(false);
      return;
    }

    const showActionsTimeout = setTimeout(() => setShowActions(true), 300);
    const showTypeTimeout = setTimeout(() => setShowType(true), 600);

    return () => {
      clearTimeout(showActionsTimeout);
      clearTimeout(showTypeTimeout);
    };
  }, [isResourceSelected]);

  const toggleCollapse = () => {
    onUpdate({ isCollapsed: !entry.isCollapsed }, false);
  };

  const getResourceName = () => {
    if (!entry.resource && !entry.customResource) {
      return 'Select a resource';
    }
    if (entry.resource === '*' || entry.customResource === '*') {
      return 'All Resources';
    }
    if (entry.resource === 'custom') {
      return entry.customResource || 'Unnamed Custom Resource';
    }
    return entry.resource;
  };

  const getResourceIcon = () => {
    if (!entry.resource && !entry.customResource) {
      return <Lock className="w-4 h-4 mr-2 text-gray-400" />;
    }
    if (entry.resource === '*' || entry.customResource === '*') {
      return <Star className="w-4 h-4 mr-2 text-blue-500" />;
    }
    if (entry.resource === 'custom') {
      return <Code className="w-4 h-4 mr-2 text-purple-500" />;
    }
    return <FileText className="w-4 h-4 mr-2 text-green-500" />;
  };

  const getEvaluationBadge = () => {
    const result = evaluationResult || 'unevaluated';
    const variantMap = {
      unevaluated: 'outline',
      allowed: 'default',
      denied: 'destructive',
    } as const;
    const classMap = {
      unevaluated: 'bg-gray-100 text-gray-800',
      allowed: 'bg-green-500 hover:bg-green-600 text-white',
      denied: 'bg-red-500 hover:bg-red-600 text-white',
    };
    const textMap = {
      unevaluated: 'Unevaluated',
      allowed: 'Allowed',
      denied: 'Denied',
    };

    return (
      <Badge
        variant={variantMap[result]}
        className={cn('ml-2', classMap[result])}
      >
        {textMap[result]}
      </Badge>
    );
  };

  return (
    <Card
      className={cn(
        'bg-muted/30 hover:bg-muted/50 transition-colors duration-200',
        entry.isCollapsed && 'overflow-hidden',
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
        <CardTitle className="text-sm font-medium flex items-center">
          {getResourceIcon()}
          {getResourceName()}
        </CardTitle>
        <div className="flex items-center space-x-2">
          {getEvaluationBadge()}
          {showRemoveButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={toggleCollapse}>
            {entry.isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {!entry.isCollapsed && (
        <CardContent className="pt-0 pb-3 space-y-4">
          <ResourceSelect
            entry={entry}
            onUpdate={(updates) => {
              onUpdate(updates, true);
              setIsResourceSelected(!!updates.resource);
            }}
            resources={resources}
          />
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              showActions
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0 overflow-hidden',
            )}
          >
            <ActionSelect
              entry={entry}
              onUpdate={(updates) => onUpdate(updates, true)}
            />
          </div>
          <div
            className={cn(
              'transition-all duration-300 ease-in-out',
              showType
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0 overflow-hidden',
            )}
          >
            <TypeSelect
              entry={entry}
              onUpdate={(updates) => onUpdate(updates, true)}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
