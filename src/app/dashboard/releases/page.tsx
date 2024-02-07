import BigCalendar from '@/components/ui/big-calendar';

export const revalidate = 0;

export default async function Releases() {
  return (
    <div>
      <h1>Releases</h1>
      <BigCalendar />
    </div>
  );
}
