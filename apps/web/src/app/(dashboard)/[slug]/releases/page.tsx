import Calendar from '@/components/dashboard/calendar';
import { Navigation, dashboardRoute } from '@/config/navigation';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';
import { EventInput } from '@fullcalendar/core/index.js';

export default async function Releases({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const releasesService = await get(ReleaseService);
  const releases = await releasesService.findAll();

  const events = releases.map(
    (release): EventInput => ({
      title: JSON.stringify({
        version: release.version,
        url: `${dashboardRoute(slug, Navigation.DASHBOARD_RELEASES_OVERVIEW).replace('[id]', release.id.toString())}`,
      }),
      allDay: true,
      date: release.date?.toISOString(),
      // interactive: true,
    }),
  );

  return (
    <div className="h-full mb-20">
      <Calendar events={events ?? []} height={'100%'} />
    </div>
  );
}
