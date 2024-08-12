'use client';

import { registerInterestAction } from '@/actions/marketing';
import { UnderlinedLink } from '@/components/common/underlined-link';
import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { appConfig } from '@/config/app';
import { CaptchaSiteKey } from '@/config/security';
import { parseServerError } from '@/lib/actions/parse-server-error';
import { registerInterestSchema } from '@/validation/marketing';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export const RegisterInterestForm = ({
  hasRegistered,
}: {
  hasRegistered?: boolean;
}) => {
  const captchaRef = useRef<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<any>();
  const [captcha, setCaptcha] = useState<string | undefined>();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [values, setValues] = useState<
    Partial<z.infer<typeof registerInterestSchema>>
  >({});

  const onExpire = () => {
    setCaptcha(undefined);
  };

  const onError = () => {
    setCaptcha(undefined);
  };

  const onSubmit = async (values: z.infer<typeof registerInterestSchema>) => {
    setSubmitting(true);

    const loadingToast = toast.loading('Registering interest', {
      closeButton: false,
    });

    // TODO: fix typing here
    const { data, serverError } =
      (await registerInterestAction({ ...values, captcha })) ?? {};

    captchaRef?.current?.resetCaptcha();

    toast.dismiss(loadingToast);
    setSubmitting(false);

    if (serverError) {
      const error = parseServerError(serverError);
      toast.error(
        <span>
          <p className="font-bold text-md">Failed to register interest</p>
          <p className="text-sm">{error?.message}</p>
        </span>,
      );
      setError(error);
      return;
    }

    // TODO: improve typing here of data
    if (data?.success) {
      toast.success('Successfully registered interest');
      setError(undefined);
      setValues({});
      setHasSubmitted(true);
    }
  };

  if (hasRegistered || hasSubmitted) {
    return (
      <div className="bg-success-100 rounded-xl p-10">
        <p className="text-2xl mb-2">Thank you for registering for interest!</p>
        <p>
          You are on the waitlist! We will be in touch soon. In the meantime,
          you can follow us on{' '}
          <UnderlinedLink href={appConfig.links.twitter}>
            X/Twitter
          </UnderlinedLink>
        </p>
        <p className="text-sm mt-3">
          Want your details removed? Email us at{' '}
          <UnderlinedLink href="mailto:waitlist@versioning.app">
            waitlist@versioning.app
          </UnderlinedLink>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-96 text-left">
      <AutoForm
        formSchema={registerInterestSchema.pick({ email: true })}
        values={values}
        onValuesChange={setValues}
        onSubmit={onSubmit}
      >
        <HCaptcha
          sitekey={CaptchaSiteKey}
          onVerify={setCaptcha}
          onError={onError}
          onExpire={onExpire}
          ref={captchaRef}
        />
        <div className="text-center">
          <AutoFormSubmit disabled={submitting}>
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Register interest'
            )}
          </AutoFormSubmit>
        </div>
        {error && <p className="text-destructive">{error?.message}</p>}
      </AutoForm>
    </div>
  );
};
