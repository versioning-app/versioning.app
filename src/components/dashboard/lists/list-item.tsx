'use client';

import {
  DataTable,
  DataTableColumnHeader,
} from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { parseServerError } from '@/lib/actions/parse-server-error';
import {
  camelToHumanReadable,
  capitalizeFirstLetter,
  cn,
  pluralize,
  prettyPrint,
} from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatDistance } from 'date-fns';

type Listable = {
  id: string;
  name?: string;
  label?: string;
  style?: string;
  hidden?: boolean;
};

export function ListItem<T extends Listable>({
  resourceName,
  resource,
  actions,
}: {
  resourceName?: string;
  resource: T;
  actions?: {
    delete?: (deleteArgs: { id: string }) => Promise<{ serverError?: string }>;
  };
}) {
  const itemContents = Object.entries(resource);

  const name = resource.name ?? resource.label;

  const [isDeleting, setDeleting] = useState(false);

  const onDelete = async ({ id }: Listable) => {
    if (isDeleting || !actions?.delete) {
      return;
    }

    setDeleting(true);

    const loadingToast = toast.loading(
      `Deleting ${resourceName} ${name ? `"${name}"` : ''}`,
      {
        closeButton: false,
      },
    );

    const { serverError } = await actions.delete({ id });
    toast.dismiss(loadingToast);

    if (serverError) {
      const error = parseServerError(serverError);
      toast.error(`${error.message} (Request Id: ${error.context?.requestId})`);
      setDeleting(false);
      return;
    }

    toast.success(`${resourceName}${name ? ` "${name}"` : ''} deleted`);
  };

  return (
    <li>
      <Card>
        <CardHeader
          className={cn('flex justify-between items-center pt-3 pb-5 px-0', {
            hidden: resource.hidden === true,
          })}
        >
          <div className="flex items-center min-h-10">
            <p className="text-xs font-bold w-full px-4">{resourceName}</p>
            {actions?.delete && (
              <Button
                className="p-2"
                variant="ghost"
                onClick={() => onDelete(resource)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Separator />
        </CardHeader>
        <CardContent className="grid gap-4">
          {itemContents.map(([key, value]) => (
            <div key={key} className="flex flex-col justify-between">
              <p className="text-xs font-light">{capitalizeFirstLetter(key)}</p>
              <pre className="text-base font-normal">
                {typeof value === 'string' ? value : prettyPrint(value)}
              </pre>
            </div>
          ))}
        </CardContent>
      </Card>
    </li>
  );
}

export function List<T extends Listable>({
  createLink,
  resources,
  actions,
  ...props
}: {
  createLink: string;
  resources?: T[];
  resourceName?: string;
  actions?: {
    delete?: (deleteArgs: { id: string }) => Promise<{ serverError?: string }>;
  };
}) {
  const resourceName = props.resourceName ?? 'resource';

  const [isDeleting, setDeleting] = useState(false);

  const onDelete = async ({ id }: Listable) => {
    if (isDeleting || !actions?.delete) {
      return { serverError: 'Already deleting' };
    }

    setDeleting(true);

    const loadingToast = toast.loading(`Deleting ${resourceName}`, {
      closeButton: false,
    });

    const { serverError } = await actions.delete({ id });
    toast.dismiss(loadingToast);

    if (serverError) {
      const error = parseServerError(serverError);
      let errorMessage = error.message.replaceAll('Resource', resourceName);

      toast.error(
        <span>
          <p className="font-bold text-md">Failed to delete {resourceName}</p>
          <p className="text-sm">{errorMessage}</p>
          <br />
          <p className="text-xxs font-mono">
            Request Id: {error.context.requestId}
          </p>
        </span>,
      );
      setDeleting(false);
      return { serverError };
    }

    toast.success(`${resourceName} deleted`);
    return { serverError };
  };

  if (!resources || resources.length === 0) {
    return (
      <div className="flex -mt-12 justify-center items-center h-full min-h-96">
        <div>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">
              It looks like you have not created any {pluralize(resourceName)}{' '}
              yet...
            </h1>
            <p className="mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              You can create a new {resourceName} by clicking the button below!
            </p>
          </div>
          <div className="justify-center text-center py-4">
            <Link href={createLink}>
              <Button size="lg">Create {resourceName}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const columns = Object.keys(resources[0]).map(
    (key) =>
      ({
        header: ({ column }: any) => (
          <DataTableColumnHeader
            column={column}
            title={camelToHumanReadable(key)}
          />
        ),
        accessorKey: key,
        cell: ({ getValue }) => {
          const value = getValue();
          if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
          }

          if (typeof value === 'object' && value instanceof Date) {
            const when = formatDistance(value, new Date(), {
              includeSeconds: true,
              addSuffix: true,
            });

            if (when === 'less than 5 seconds ago') {
              return 'just now';
            }

            return when;
          }

          return String(value);
        },
      }) satisfies ColumnDef<any, any>,
  );

  return (
    <DataTable
      columns={columns}
      data={resources}
      actions={actions?.delete ? { delete: onDelete } : undefined}
    />
  );

  // return (
  //   <ul className="grid grid-cols-3 lg:grid-cols-4 gap-4">
  //     {resources.map((resource) => (
  //       <ListItem
  //         key={resource.id}
  //         resource={resource}
  //         resourceName={resourceName}
  //         actions={actions}
  //       />
  //     ))}
  //   </ul>
  // );
}
