import { cn } from '@/lib';
import Image, { ImageProps } from 'next/image';

export const Logo = ({
  className,
  ...props
}: Omit<ImageProps, 'src' | 'alt'>) => (
  <Image
    src="/logo.svg"
    alt="versioning.app Logo"
    width={60}
    height={60}
    className={cn('dark:invert inline-block align-middle', className)}
    {...props}
  />
);
