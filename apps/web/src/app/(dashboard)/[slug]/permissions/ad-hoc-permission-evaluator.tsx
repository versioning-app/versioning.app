'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PermissionAction, Permissions } from '@/database/schema';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { Database, Globe, Plus, Trash2, Zap } from 'lucide-react';

type EvaluatePermissionFunction = (
  resource: string,
  actions: PermissionAction[],
  types: Permissions[],
  roleIds: string[],
) => Promise<boolean>;

type FetchRolesFunction = () => Promise<{ id: string; name: string }[]>;

type FetchAvailableResourcesFunction = () => Promise<{
  tables: string[];
}>;

const ACTIONS: PermissionAction[] = [
  'read',
  'create',
  'update',
  'delete',
  'manage',
  'execute',
];
const TYPES: Permissions[] = ['db', 'api', 'action'];

const TYPE_MAP: Record<
  Permissions,
  { label: string; icon: React.ElementType }
> = {
  db: { label: 'Database', icon: Database },
  api: { label: 'API', icon: Globe },
  action: { label: 'Action', icon: Zap },
};

type PermissionEntry = {
  id: string;
  resource: string;
  customResource: string;
  actions: PermissionAction[];
  type: Permissions | null;
};

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
    [{ id: '1', resource: '', customResource: '', actions: [], type: null }],
  );
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [evaluationResults, setEvaluationResults] = useState<
    (boolean | null)[]
  >([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [resources, setResources] = useState<{ tables: string[] }>({
    tables: [],
  });

  useEffect(() => {
    fetchRoles().then(setRoles);
    fetchAvailableResources().then(setResources);
  }, [fetchRoles, fetchAvailableResources]);

  const handleAddPermissionEntry = () => {
    setPermissionEntries((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        resource: '',
        customResource: '',
        actions: [],
        type: null,
      },
    ]);
    setEvaluationResults((prev) => [...prev, null]);
  };

  const handleRemovePermissionEntry = (id: string) => {
    setPermissionEntries((prev) => prev.filter((entry) => entry.id !== id));
    setEvaluationResults((prev) => prev.slice(0, -1));
  };

  const updatePermissionEntry = (
    id: string,
    updates: Partial<PermissionEntry>,
  ) => {
    setPermissionEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry)),
    );
  };

  const handleEvaluatePermissions = async () => {
    setIsEvaluating(true);
    const results = await Promise.all(
      permissionEntries.map(async (entry) => {
        const resourceToEvaluate =
          entry.resource === 'custom' ? entry.customResource : entry.resource;
        if (
          !resourceToEvaluate ||
          entry.actions.length === 0 ||
          entry.type === null
        ) {
          return null;
        }
        return evaluatePermission(
          resourceToEvaluate,
          entry.actions,
          [entry.type],
          selectedRoles,
        );
      }),
    );
    setEvaluationResults(results);
    setIsEvaluating(false);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-background shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">
            Ad-hoc Permission Evaluator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {permissionEntries.map((entry, index) => (
              <Card key={entry.id} className="bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-semibold">
                    Permission {index + 1}
                  </CardTitle>
                  {permissionEntries.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePermissionEntry(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`resource-${entry.id}`}>Resource</Label>
                      <Select
                        onValueChange={(value) =>
                          updatePermissionEntry(entry.id, { resource: value })
                        }
                        value={entry.resource}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a resource" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="custom">
                            Custom Resource
                          </SelectItem>
                          {resources.tables.map((table) => (
                            <SelectItem key={table} value={table}>
                              {table}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {(entry.resource === 'custom' ||
                        !resources.tables.includes(entry.resource)) && (
                        <Input
                          placeholder="Enter resource name"
                          value={
                            entry.resource === 'custom'
                              ? entry.customResource
                              : entry.resource
                          }
                          onChange={(e) =>
                            updatePermissionEntry(entry.id, {
                              customResource: e.target.value,
                            })
                          }
                          className="mt-2"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Actions</Label>
                      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background">
                        {ACTIONS.map((action) => (
                          <Badge
                            key={action}
                            variant={
                              entry.actions.includes(action)
                                ? 'default'
                                : 'outline'
                            }
                            className="cursor-pointer capitalize"
                            onClick={() => {
                              const newActions = entry.actions.includes(action)
                                ? entry.actions.filter((a) => a !== action)
                                : [...entry.actions, action];
                              updatePermissionEntry(entry.id, {
                                actions: newActions,
                              });
                            }}
                          >
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Type</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {TYPES.map((t) => {
                        const { label, icon: Icon } = TYPE_MAP[t];
                        return (
                          <Badge
                            key={t}
                            variant={entry.type === t ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() =>
                              updatePermissionEntry(entry.id, {
                                type: entry.type === t ? null : t,
                              })
                            }
                          >
                            <Icon className="w-4 h-4 mr-1" />
                            {label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  {evaluationResults[index] !== null &&
                    evaluationResults[index] !== undefined && (
                      <div
                        className={`mt-4 p-3 rounded-md ${
                          evaluationResults[index]
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                        }`}
                      >
                        <p className="font-medium">
                          Permission{' '}
                          {evaluationResults[index] ? 'granted' : 'denied'}
                        </p>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
            <Button
              onClick={handleAddPermissionEntry}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Permission
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedRoles.length === 0 && (
              <Badge variant="secondary" className="mb-2">
                <InfoCircledIcon className="w-3 h-3 mr-1" />
                Using current roles
              </Badge>
            )}
            <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted max-h-40 overflow-y-auto">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onCheckedChange={() => {
                      setSelectedRoles((prev) =>
                        prev.includes(role.id)
                          ? prev.filter((r) => r !== role.id)
                          : [...prev, role.id],
                      );
                    }}
                    className="mr-2"
                  />
                  <Label
                    htmlFor={`role-${role.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {role.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleEvaluatePermissions}
        disabled={
          isEvaluating ||
          permissionEntries.some(
            (entry) =>
              (!entry.resource && !entry.customResource) ||
              entry.actions.length === 0 ||
              entry.type === null,
          )
        }
        className="w-full py-6 text-lg font-semibold"
      >
        {isEvaluating ? 'Evaluating...' : 'Evaluate Permissions'}
      </Button>
    </div>
  );
}
