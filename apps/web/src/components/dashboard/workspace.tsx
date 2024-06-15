'use client';

import { changeSlugAction } from '@/actions/workspace';
import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { parseServerError } from '@/lib/actions/parse-server-error';
import { AppErrorJson } from '@/lib/error/app.error';
import { changeSlugSchema } from '@/validation/workspace';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export function ChangeSlugForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AppErrorJson>();
  const [values, setValues] = useState<
    Partial<z.infer<typeof changeSlugSchema>>
  >({});

  const updateValues = (values: Partial<z.infer<typeof changeSlugSchema>>) => {
    setValues({
      ...values,
      slug: values.slug?.toLowerCase(),
    });
  };

  const onSubmit = async (values: z.infer<typeof changeSlugSchema>) => {
    setSubmitting(true);

    const loadingToast = toast.loading(
      `Changing workspace slug to "${values.slug}"`,
      {
        closeButton: false,
      },
    );

    const { data: updatedWorkspace, serverError } =
      await changeSlugAction(values);

    toast.dismiss(loadingToast);
    setSubmitting(false);

    if (serverError) {
      const error = parseServerError(serverError);
      let errorMessage = error.message;

      toast.error(
        <span>
          <p className="font-bold text-md">Failed to change slug</p>
          <p className="text-sm">{errorMessage}</p>
          <br />
          <p className="text-xxs font-mono">
            Request Id: {error.context.requestId}
          </p>
        </span>,
      );
      setError(error);
      return;
    }

    if (updatedWorkspace) {
      toast.success(`Workspace slug updated to "${updatedWorkspace.slug}"`);
      setError(undefined);
      setValues({});
      router.push(
        dashboardRoute(updatedWorkspace.slug, Navigation.DASHBOARD_SETTINGS),
      );
    }
  };

  return (
    <AutoForm
      formSchema={changeSlugSchema}
      values={values}
      onValuesChange={updateValues}
      onSubmit={onSubmit}
      fieldConfig={{
        slug: {
          description: 'Slug for the current workspace',
          inputProps: {
            placeholder: 'New slug',
          },
        },
      }}
    >
      <AutoFormSubmit disabled={submitting}>
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Change slug'
        )}
      </AutoFormSubmit>
      {error && <p className="text-destructive">{error?.message}</p>}
    </AutoForm>
  );
}
