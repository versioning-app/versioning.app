'use client';

import { changeSlugAction } from '@/actions/workspace';
import { AutoForm } from '@/components/ui/autoform';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { parseServerError } from '@/lib/actions/parse-server-error';
import { AppErrorJson } from '@/lib/error/app.error';
import { changeSlugSchema } from '@/validation/workspace';
import { ZodProvider } from '@autoform/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export function ChangeSlugForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AppErrorJson>();

  const onSubmit = async (values: z.infer<typeof changeSlugSchema>) => {
    setSubmitting(true);

    values.slug = values.slug.toLowerCase();

    const loadingToast = toast.loading(
      `Changing workspace slug to "${values.slug}"`,
      {
        closeButton: false,
      },
    );

    const { data: updatedWorkspace, serverError } =
      (await changeSlugAction(values)) ?? {};

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
      router.push(
        dashboardRoute(updatedWorkspace.slug, Navigation.DASHBOARD_SETTINGS),
      );
    }
  };

  const schemaProvider = new ZodProvider(changeSlugSchema);

  return (
    <AutoForm schema={schemaProvider} onSubmit={onSubmit}>
      {submitting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        'Change slug'
      )}
      {error && <p className="text-destructive">{error?.message}</p>}
    </AutoForm>
  );
}
