'use client';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import FullCalendar from '@fullcalendar/react';

export default function Calendar(props: CalendarOptions) {
  return (
    <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} {...props} />
  );
}
