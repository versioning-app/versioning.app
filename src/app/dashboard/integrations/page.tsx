import { unstable_noStore as noStore } from 'next/cache';

export default async function Integrations() {
  noStore();

  return (
    <div>
      <h1>Integrations</h1>
    </div>
  );
}
