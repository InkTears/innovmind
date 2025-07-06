import { useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Layout from '../components/Layout';
import { deadlines } from '../mocks/deadlines';

export default function CalendarPage() {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthEvents = deadlines.filter(d => {
    const ev = new Date(d.date);
    return (
      ev.getFullYear() === viewDate.getFullYear() &&
      ev.getMonth()    === viewDate.getMonth()
    );
  });

  const dayEvents = selectedDate
    ? deadlines.filter(d => {
        const ev = new Date(d.date);
        return ev.toDateString() === selectedDate.toDateString();
      })
    : [];

  const tileContent = ({ date: tileDate, view }) => {
    if (
      view === 'month' &&
      monthEvents.some(d => new Date(d.date).getDate() === tileDate.getDate())
    ) {
      return <span className="calendar-event-dot" />;
    }
    return null;
  };

  return (
    <Layout>
      <div className="container">
        <h1>Calendrier</h1>
        <ReactCalendar
          onChange={d => {
            setViewDate(d);
            setSelectedDate(null);
          }}
          value={viewDate}
          locale="fr-FR"
          tileContent={tileContent}
          nextLabel="›"
          prevLabel="‹"
          next2Label={null}
          prev2Label={null}
          onClickDay={d => setSelectedDate(d)}
        />

        {selectedDate ? (
          <>
            <h2>Échéances du {selectedDate.toLocaleDateString('fr-FR')}</h2>
            {dayEvents.length > 0 ? (
              <ul>
                {dayEvents.map(d => (
                  <li key={d.id}>{d.title}</li>
                ))}
              </ul>
            ) : (
              <p>Aucune échéance ce jour.</p>
            )}
          </>
        ) : (
          <>
            <h2>
              Échéances en{' '}
              {viewDate.toLocaleString('fr-FR', {
                month: 'long',
                year: 'numeric'
              })}
            </h2>
            <ul>
              {monthEvents.map(d => (
                <li key={d.id}>
                  {d.date}: {d.title}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Layout>
  );
}
