import Calendar from '@/components/dashboard/calendar';
import { Button } from '@/components/ui/button';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';
import { EventInput } from '@fullcalendar/core/index.js';
import Link from 'next/link';

export default async function Releases({
  params: { slug },
}: {
  params: { slug: string };
}) {
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
      <Link href={dashboardRoute(slug, Navigation.DASHBOARD_RELEASES_OVERVIEW)}>
        <Button>View overview</Button>
      </Link>
      <Calendar events={events ?? []} height={'100%'} />
    </div>
  );
}
