'use server';
import { CaptchaSecretKey, CaptchaSiteKey } from '@/config/security';
import { AppError } from '@/lib/error/app.error';
import { ErrorCodes } from '@/lib/error/error-codes';
import { serverLogger } from '@/lib/logger/server';
import { action } from '@/lib/safe-action';
import { LeadService } from '@/services/lead.service';
import { get } from '@/services/service-factory';
import { registerInterestSchema } from '@/validation/marketing';
import { verify } from 'hcaptcha';

export const registerInterestAction = action
  .schema(registerInterestSchema)
  .action(async ({ parsedInput }) => {
    const logger = await serverLogger({ name: 'registerInterestAction' });

    logger.debug({ parsedInput }, 'Registering interest');

    // Verify the captcha
    const { captcha } = parsedInput;

    if (!captcha) {
      logger.warn({ parsedInput }, 'Captcha verification failed');

      throw new AppError(
        'Captcha verification failed',
        ErrorCodes.INVALID_CAPTCHA,
      );
    }

    const captchaResponse = await verify(
      CaptchaSecretKey,
      captcha,
      undefined,
      CaptchaSiteKey,
    );

    if (!captchaResponse.success) {
      logger.warn(
        { captchaResponse, parsedInput },
        'Captcha verification failed',
      );

      throw new AppError(
        'Captcha verification failed',
        ErrorCodes.INVALID_CAPTCHA,
      );
    }

    logger.debug('Captcha verification successful');

    const lead = await get(LeadService).create({ email: parsedInput.email });

    if (!lead) {
      throw new AppError(
        'Failed to create lead',
        ErrorCodes.RESOURCE_NOT_FOUND,
      );
    }

    logger.info({ lead }, 'Lead successfully created');
    return { success: true };
  });
