'use client';

import { AutoForm } from '@/components/ui/autoform';
import { NavigationItem, dashboardRoute } from '@/config/navigation';
import { parseServerError } from '@/lib/actions/parse-server-error';
import { AppErrorJson } from '@/lib/error/app.error';
import { ActionTypeFn } from '@/types/action';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { ZodProvider } from '@autoform/zod';
import { FieldConfig } from '@autoform/react';

export function InputForm<Schema extends z.ZodObject>({
  schema,
  action,
  resource = 'Resource',
  postSubmitLink,
  fieldConfig,
}: {
  schema: Schema & any;
  action: ActionTypeFn<Schema>;
  resource?: string;
  postSubmitLink: NavigationItem;
  fieldConfig?: FieldConfig<z.infer<Schema>>;
}) {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AppErrorJson>();

  const onSubmit = async (values: z.infer<Schema>) => {
    setSubmitting(true);

    const loadingToast = toast.loading(`Creating ${resource}`, {
      closeButton: false,
    });

    // TODO: fix typing here
    const { data, serverError } = (await action(values)) ?? {};

    toast.dismiss(loadingToast);
    setSubmitting(false);

    if (serverError) {
      const error = parseServerError(serverError);
      toast.error(
        <span>
          <p className="font-bold text-md">Failed to create {resource}</p>
          <p className="text-sm">{error?.message}</p>
          <br />
          <p className="text-xxs font-mono">
            Request Id: {error.context.requestId}
          </p>
        </span>,
      );
      setError(error);
      return;
    }

    // TODO: improve typing here of data
    if (data) {
      toast.success(`${resource} created`);
      setError(undefined);
      console.log('postSubmitLink', postSubmitLink);
      router.push(dashboardRoute(slug, postSubmitLink));
      router.refresh();
    }
  };

  const schemaProvider = new ZodProvider(schema);

  return (
    <>
      <p className="text-xl font-bold mb-4">Create {resource}</p>
      <AutoForm schema={schemaProvider} onSubmit={onSubmit}>
        {/* <AutoFormSubmit disabled={submitting}> */}
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          `Create ${resource}`
        )}
        {/* </AutoFormSubmit> */}
        {error && <p className="text-destructive">{error?.message}</p>}
      </AutoForm>
    </>
  );
}
