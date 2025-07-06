import { deadlines } from '../mocks/deadlines';

export default function NotificationPopover({ isOpen }) {
  if (!isOpen) return null;
  return (
    <div className="notification-popover">
      <ul>
        {deadlines.map(d => (
          <li key={d.id}>{d.date}: {d.title}</li>
        ))}
      </ul>
    </div>
); }