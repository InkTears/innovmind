import { useState } from 'react';
import Link from 'next/link';
import { FiBell } from 'react-icons/fi';
import NotificationPopover from './NotificationPopover';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="layout">
      <header>
        <h1 style={{ color: 'var(--color-secondary)' }}>FocusEd</h1>
        <nav>
          <Link href="/">Dashboard</Link>
          <Link href="/courses">Cours</Link>
          <Link href="/courses/upload">Ajouter un cours</Link>
          <Link href="/calendar">Calendrier</Link>
        </nav>
        <div className="notification-icon" onClick={() => setOpen(!open)}>
          <FiBell />
        </div>
        <NotificationPopover isOpen={open} />
      </header>
      <main className="container-page">{children}</main>
    </div>
);
  }