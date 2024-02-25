'use client';

import { deleteComponentAction } from '@/actions/components';
import { Button } from '@/components/ui/button';
import { Component } from '@/database/schema';
import { parseServerError } from '@/lib/actions/parse-server-error';
import { cn } from '@/lib/utils';
import { Loader2, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const ComponentListItem = ({ component }: { component: Component }) => {
  const [isDeleting, setDeleting] = useState(false);
  const onDelete = async ({ id, name }: Component) => {
    if (isDeleting) {
      return;
    }
    setDeleting(true);

    const loadingToast = toast.loading(`Deleting component "${name}"`, {
      closeButton: false,
    });

    const { serverError } = await deleteComponentAction({ id });
    toast.dismiss(loadingToast);

    if (serverError) {
      const error = parseServerError(serverError);
      toast.error(error.message);
      return;
    }

    toast.success(`Component "${name}" deleted`);
  };

  return (
    <li
      key={component.id}
      className="text-sm p-4 bg-secondary inline m-2 rounded-sm"
    >
      <div className="flex">
        <div className="flex-1 min-h-12">
          <p className="min-w-12">{component.name}</p>
          <p className="text-xs">
            {component.description ?? 'No description...'}
          </p>
        </div>
        <Button
          variant="destructive"
          className="cursor-pointer dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
          onClick={async () => onDelete(component)}
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <TrashIcon className={cn('w-4 h-4')} aria-disabled={isDeleting} />
          )}

          <span className="sr-only">Delete component</span>
        </Button>
      </div>
    </li>
  );
};

export const ComponentList = ({ components }: { components?: Component[] }) => {
  if (!components || components.length === 0) {
    return <p>No components</p>;
  }

  return (
    <ul className="flex flex-col max-w-80">
      {components.map((component) => (
        <ComponentListItem key={component.id} component={component} />
      ))}
    </ul>
  );
};
