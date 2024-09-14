import { ReleaseOverview } from '@/components/dashboard/release-overview';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';

export default async function OverviewPage({
  params: { slug, id },
}: {
  params: { slug: string; id: string };
}) {
  const releaseService = get(ReleaseService);
  const overviews = await releaseService.getOverview(id);

  return (
    <div className="mb-24 h-full w-full">
      <ReleaseOverview data={overviews} />
    </div>
  );
}
