'use client';

import {
  createComponentAction,
  deleteComponentAction,
} from '@/actions/components';
import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { Button } from '@/components/ui/button';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { Component } from '@/database/schema';
import { parseServerError } from '@/lib/actions/parse-server-error';
import { AppErrorJson } from '@/lib/error/app.error';
import { cn } from '@/lib/utils';
import { createComponentSchema } from '@/validation/component';
import { Loader2, TrashIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

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

    const { serverError } = await deleteComponentAction({ componentId: id });
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

export function CreateComponentForm() {
  const router = useRouter();
  const { slug } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AppErrorJson>();
  const [values, setValues] = useState<
    Partial<z.infer<typeof createComponentSchema>>
  >({});

  const onSubmit = async (values: z.infer<typeof createComponentSchema>) => {
    setSubmitting(true);

    const loadingToast = toast.loading(`Creating component "${values.name}"`, {
      closeButton: false,
    });

    const { data: component, serverError } =
      await createComponentAction(values);

    toast.dismiss(loadingToast);
    setSubmitting(false);

    if (serverError) {
      const error = parseServerError(serverError);
      toast.error('Error whilst creating component', {
        description: `${error.message} (Request Id: ${error.context.requestId})`,
      });
      setError(error);
      return;
    }

    if (component) {
      toast.success(`Component "${component.name}" created`);
      setError(undefined);
      setValues({});
      router.push(dashboardRoute(slug, Navigation.DASHBOARD_COMPONENTS));
    }
  };

  return (
    <AutoForm
      formSchema={createComponentSchema}
      values={values}
      onValuesChange={setValues}
      onSubmit={onSubmit}
      fieldConfig={{
        name: {
          description: 'Name of the component we are creating',
          inputProps: {
            placeholder: 'Component name',
          },
        },
        description: {
          description: 'Explanation of what the component does',
          fieldType: 'textarea',
          inputProps: {
            placeholder: 'Component description',
          },
        },
      }}
    >
      <AutoFormSubmit disabled={submitting}>
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Create Component'
        )}
      </AutoFormSubmit>
      {error && <p className="text-destructive">{error?.message}</p>}
    </AutoForm>
  );
}
