import { cn } from '@/lib/utils';
import Image, { ImageProps } from 'next/image';

export const Logo = ({
  className,
  size,
  ...props
}: Omit<ImageProps, 'src' | 'alt'> & { size?: number }) => (
  <Image
    src="/logo.svg"
    alt="versioning.app Logo"
    width={size ?? 60}
    height={size ?? 60}
    className={cn('dark:invert inline-block align-middle', className)}
    {...props}
  />
);
