import { cn } from '@/lib/utils';
import Link, { LinkProps } from 'next/link';

interface UnderlinedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export function UnderlinedLink({
  children,
  className,
  ...props
}: UnderlinedLinkProps) {
  return (
    <Link
      className={cn(
        'text-sm text-gray-500 hover:underline underline-offset-4 dark:text-gray-400',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
