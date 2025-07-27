import { ReleaseOverview } from '@/components/dashboard/release-overview';
import { ReleaseService } from '@/services/release.service';
import { get } from '@/services/service-factory';

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const releaseService = await get(ReleaseService);
  const overviews = await releaseService.getOverview(id);

  return (
    <div className="mb-24 h-full w-full">
      <ReleaseOverview data={overviews} />
    </div>
  );
}
