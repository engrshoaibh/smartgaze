import Calendar from 'react-calendar';

export default function EventCalendar() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Event Calendar</h2>
      <Calendar />
    </div>
  );
}
