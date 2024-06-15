'use client';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import FullCalendar from '@fullcalendar/react';
import Link from 'next/link';

export default function Calendar(props: CalendarOptions) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      eventContent={function (arg) {
        const parsed = JSON.parse(arg.event.title);
        return (
          <Link href={parsed.url} className="cursor-pointer block w-full">
            {parsed.version}
          </Link>
        );
      }}
      {...props}
    />
  );
}
