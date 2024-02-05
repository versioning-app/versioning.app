import { unstable_noStore as noStore } from 'next/cache';

export default async function Releases() {
  noStore();
  return (
    <div>
      <h1>Releases</h1>
    </div>
  );
}
