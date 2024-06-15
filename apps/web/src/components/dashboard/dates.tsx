'use client';

import { toast } from 'sonner';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { format, formatDistanceToNow } from 'date-fns';

export const DateRenderer = ({ value }: { value: Date }) => {
  const date = value instanceof Date ? value : new Date(value);
  let when = formatDistanceToNow(date, {
    includeSeconds: true,
    addSuffix: true,
  });

  if (when === 'less than 5 seconds ago') {
    when = 'just now';
  }

  const humanDate = format(date, 'hh:mm:ss a dd/LL/yyyy O');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(date.toISOString());
    toast.success('Date copied', {
      description: 'Date successfully copied to clipboard',
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="underline decoration-dotted hover:decoration-solid"
          onClick={copyToClipboard}
        >
          {when}
        </TooltipTrigger>
        <TooltipContent>
          <p>{humanDate}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
