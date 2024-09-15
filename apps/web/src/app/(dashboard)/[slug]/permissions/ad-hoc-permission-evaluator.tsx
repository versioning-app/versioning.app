'use client';

import { PermissionEntryCard } from '@/components/permissions/permission-entry-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  EvaluatePermissionFunction,
  FetchAvailableResourcesFunction,
  FetchRolesFunction,
  PermissionEntry,
  TYPE_MAP,
} from '@/types/permissions';
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Plus,
  Shield,
  Loader2,
} from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

export function AdHocPermissionEvaluator({
  evaluatePermission,
  fetchRoles,
  fetchAvailableResources,
}: {
  evaluatePermission: EvaluatePermissionFunction;
  fetchRoles: FetchRolesFunction;
  fetchAvailableResources: FetchAvailableResourcesFunction;
}) {
  const [permissionEntries, setPermissionEntries] = useState<PermissionEntry[]>(
    [
      {
        id: '1',
        resource: '',
        customResource: '',
        actions: [],
        type: null,
        isCollapsed: false,
      },
    ],
  );
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [evaluationResults, setEvaluationResults] = useState<
    ('allowed' | 'denied' | 'unevaluated')[]
  >(['unevaluated']);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [resources, setResources] = useState<{ tables: string[] }>({
    tables: [],
  });
  const [useCurrentRoles, setUseCurrentRoles] = useState(true);
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [shouldEvaluate, setShouldEvaluate] = useState(false);

  useEffect(() => {
    fetchRoles().then(setRoles);
    fetchAvailableResources().then(setResources);
  }, [fetchRoles, fetchAvailableResources]);

  const isReadyToEvaluate = useCallback(() => {
    return (
      permissionEntries.every(
        (entry) =>
          (entry.resource || entry.customResource) &&
          entry.actions.length > 0 &&
          entry.type !== null,
      ) &&
      (useCurrentRoles || selectedRoles.length > 0)
    );
  }, [permissionEntries, useCurrentRoles, selectedRoles]);

  const handleEvaluatePermissions = useCallback(async () => {
    if (!isReadyToEvaluate()) {
      return;
    }

    setIsEvaluating(true);
    try {
      const results = await Promise.all(
        permissionEntries.map(async (entry) => {
          const resourceToEvaluate =
            entry.resource === 'custom' ? entry.customResource : entry.resource;
          try {
            const result = await evaluatePermission(
              resourceToEvaluate!,
              entry.actions,
              [entry.type!],
              useCurrentRoles ? [] : selectedRoles,
            );
            return result ? 'allowed' : 'denied';
          } catch (error) {
            return 'unevaluated';
          }
        }),
      );
      setEvaluationResults(results);
      toast.success('Evaluation Complete', {
        description: 'Permissions have been evaluated successfully.',
      });
    } catch (error) {
      toast.error('Evaluation Error', {
        description:
          'An error occurred while evaluating permissions. Please try again.',
      });
    } finally {
      setIsEvaluating(false);
    }
  }, [
    evaluatePermission,
    isReadyToEvaluate,
    permissionEntries,
    useCurrentRoles,
    selectedRoles,
  ]);

  useEffect(() => {
    if (isReadyToEvaluate()) {
      handleEvaluatePermissions();
    }
  }, [
    isReadyToEvaluate,
    handleEvaluatePermissions,
    permissionEntries,
    selectedRoles,
    useCurrentRoles,
  ]);

  const handleAddPermissionEntry = () => {
    setPermissionEntries((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        resource: '',
        customResource: '',
        actions: [],
        type: null,
        isCollapsed: false,
      },
    ]);
    setEvaluationResults((prev) => [...prev, 'unevaluated']);
  };

  const handleRemovePermissionEntry = (id: string) => {
    setPermissionEntries((prev) => {
      const indexToRemove = prev.findIndex((entry) => entry.id === id);
      if (indexToRemove === -1) return prev;
      const newEntries = prev.filter((entry) => entry.id !== id);
      setEvaluationResults((prevResults) => {
        const newResults = [...prevResults];
        newResults.splice(indexToRemove, 1);
        return newResults;
      });
      return newEntries;
    });
  };

  const updatePermissionEntry = (
    id: string,
    updates: Partial<PermissionEntry>,
    triggerEvaluation: boolean = false,
  ) => {
    setPermissionEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)),
    );
    if (triggerEvaluation && isReadyToEvaluate()) {
      handleEvaluatePermissions();
    }
  };

  const toggleAllCollapsed = () => {
    const newCollapsedState = !allCollapsed;
    setAllCollapsed(newCollapsedState);
    setPermissionEntries((prev) =>
      prev.map((entry) => ({ ...entry, isCollapsed: newCollapsedState })),
    );
  };

  return (
    <div className="space-y-6 w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Permission Entries
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={toggleAllCollapsed}>
              {allCollapsed ? (
                <ChevronDown className="w-4 h-4 mr-2" />
              ) : (
                <ChevronUp className="w-4 h-4 mr-2" />
              )}
              {allCollapsed ? 'Expand All' : 'Collapse All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {permissionEntries.map((entry, index) => (
            <PermissionEntryCard
              key={entry.id}
              entry={entry}
              index={index}
              onRemove={() => handleRemovePermissionEntry(entry.id)}
              onUpdate={(
                updates: Partial<PermissionEntry>,
                triggerEvaluation: boolean = false,
              ) => updatePermissionEntry(entry.id, updates, triggerEvaluation)}
              resources={resources.tables}
              showRemoveButton={permissionEntries.length > 1}
              evaluationResult={evaluationResults[index]}
            />
          ))}
          <Button
            onClick={handleAddPermissionEntry}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Permission Entry
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center justify-between">
            <span className="flex items-center">
              Roles
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 ml-2 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Choose whether to use your current roles or select
                      specific roles for permission evaluation.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
            <div className="flex items-center space-x-2">
              <Switch
                id="use-current-roles"
                checked={useCurrentRoles}
                onCheckedChange={(checked) => {
                  setUseCurrentRoles(checked);
                  if (checked) {
                    setSelectedRoles([]);
                  }
                  if (isReadyToEvaluate()) {
                    handleEvaluatePermissions();
                  }
                }}
              />
              <Label htmlFor="use-current-roles" className="text-sm">
                Use current roles
              </Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => {
                const isSystemRole = role.name.startsWith('[SYSTEM]');
                const displayName = isSystemRole
                  ? role.name.replace('[SYSTEM]', '').trim()
                  : role.name;

                return (
                  <div
                    key={role.id}
                    className={cn(
                      'flex items-center space-x-2 p-3 rounded-md transition-colors cursor-pointer',
                      selectedRoles.includes(role.id)
                        ? 'bg-primary/10 hover:bg-primary/20'
                        : 'hover:bg-muted',
                      useCurrentRoles && 'opacity-50 cursor-not-allowed',
                    )}
                    onClick={() => {
                      if (!useCurrentRoles) {
                        setSelectedRoles((prev) =>
                          prev.includes(role.id)
                            ? prev.filter((r) => r !== role.id)
                            : [...prev, role.id],
                        );
                        if (isReadyToEvaluate()) {
                          handleEvaluatePermissions();
                        }
                      }
                    }}
                  >
                    <Checkbox
                      id={`role-${role.id}`}
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={(checked) => {
                        if (!useCurrentRoles) {
                          setSelectedRoles((prev) =>
                            checked
                              ? [...prev, role.id]
                              : prev.filter((r) => r !== role.id),
                          );
                          if (isReadyToEvaluate()) {
                            handleEvaluatePermissions();
                          }
                        }
                      }}
                      disabled={useCurrentRoles}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Label
                      htmlFor={`role-${role.id}`}
                      className={cn(
                        'text-sm font-medium flex items-center space-x-2 cursor-pointer select-none',
                        useCurrentRoles && 'cursor-not-allowed',
                      )}
                    >
                      <span>{displayName}</span>
                      {isSystemRole && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Shield className="w-4 h-4 text-blue-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Generated system role</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </Label>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          {!useCurrentRoles && (
            <p className="text-sm text-muted-foreground mt-4">
              {selectedRoles.length} role(s) selected
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Results</CardTitle>
        </CardHeader>
        <CardContent>
          {isEvaluating ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : evaluationResults.some((result) => result !== 'unevaluated') ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionEntries.map((entry, index) => {
                  const result = evaluationResults[index];
                  if (result === 'unevaluated') return null;
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <Badge
                          variant={
                            result === 'allowed' ? 'default' : 'destructive'
                          }
                          className={cn(
                            'w-28 justify-center',
                            result === 'allowed'
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-red-500 hover:bg-red-600 text-white',
                          )}
                        >
                          {result === 'allowed' ? 'Allowed' : 'Denied'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {entry.resource === 'custom'
                          ? entry.customResource
                          : entry.resource}
                      </TableCell>
                      <TableCell>
                        {entry.actions
                          .map(
                            (action) =>
                              action.charAt(0).toUpperCase() + action.slice(1),
                          )
                          .join(', ')}
                      </TableCell>
                      <TableCell>
                        {entry.type ? (
                          <div className="flex items-center space-x-2">
                            {React.createElement(TYPE_MAP[entry.type].icon, {
                              className: 'w-4 h-4',
                            })}
                            <span>{TYPE_MAP[entry.type].label}</span>
                          </div>
                        ) : (
                          'No type'
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No evaluation results yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
