'use client';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { FieldConfig } from '@/components/ui/auto-form/types';
import { NavigationItem, dashboardRoute } from '@/config/navigation';
import { parseServerError } from '@/lib/actions/parse-server-error';
import { AppErrorJson } from '@/lib/error/app.error';
import { Loader2 } from 'lucide-react';
import { SafeActionFn } from 'next-safe-action';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export function InputForm<
  Schema extends z.ZodObject<any, any> = z.ZodObject<any, any>,
  ActionType extends (input: z.infer<Schema>) => Promise<{
    data?: ({ success: boolean } & { [key: string]: unknown }) | null;
    serverError?: string;
    validationErrors?: Partial<
      Record<keyof z.infer<Schema> | '_root', string[]>
    >;
  }> = (input: z.infer<Schema>) => Promise<{
    data?: ({ success: boolean } & { [key: string]: unknown }) | null;
    serverError?: string;
    validationErrors?: Partial<
      Record<keyof z.infer<Schema> | '_root', string[]>
    >;
  }>,
>({
  schema,
  action,
  resource = 'Resource',
  postSubmitLink,
  fieldConfig,
}: {
  schema: Schema;
  action: SafeActionFn<any, Schema, any, any, any, any>;
  resource?: string;
  postSubmitLink: NavigationItem;
  fieldConfig?: FieldConfig<z.infer<Schema>>;
}) {
  const router = useRouter();
  const { slug } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AppErrorJson>();
  const [values, setValues] = useState<Partial<z.infer<typeof schema>>>({});

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setSubmitting(true);

    const loadingToast = toast.loading(`Creating ${resource}`, {
      closeButton: false,
    });

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

    if (data?.success) {
      toast.success(`${resource} created`);
      setError(undefined);
      setValues({});
      console.log('postSubmitLink', postSubmitLink);
      router.push(dashboardRoute(slug, postSubmitLink));
      router.refresh();
    }
  };

  return (
    <>
      <p className="text-xl font-bold mb-4">Create {resource}</p>
      <AutoForm
        formSchema={schema}
        values={values}
        onValuesChange={setValues}
        onSubmit={onSubmit}
        fieldConfig={fieldConfig}
      >
        <AutoFormSubmit disabled={submitting}>
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            `Create ${resource}`
          )}
        </AutoFormSubmit>
        {error && <p className="text-destructive">{error?.message}</p>}
      </AutoForm>
    </>
  );
}
