import BigCalendar from '@/components/ui/big-calendar';

export default async function Releases() {
  return (
    <div>
      <h1>Releases</h1>
      <BigCalendar
        datePickerProps={{
          weekStartsOn: 1,
          showOutsideDays: true,
        }}
      />
    </div>
  );
}
