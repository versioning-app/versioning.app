import Calendar from '@/components/dashboard/calendar';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';
import { EventInput } from '@fullcalendar/core/index.js';

export default async function Releases() {
  const releases = await get(ReleaseService).findAll();

  const events = releases.map(
    (release): EventInput => ({
      title: release.version,
      allDay: true,
      date: release.date?.toISOString(),
    }),
  );

  return (
    <div className="h-full mb-20">
      <Calendar events={events ?? []} height={'100%'} />
    </div>
  );
}
