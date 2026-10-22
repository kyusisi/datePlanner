import {
  CalendarDays,
  Heart,
  House,
  Map,
  MapPin,
  Settings,
} from 'lucide-react';
import { Link, NavLink, Outlet, useNavigation } from 'react-router';
import { LoadingState } from './Feedback';

const navigation = [
  { to: '/', label: '홈', icon: House },
  { to: '/places', label: '장소', icon: MapPin },
  { to: '/plans', label: '일정', icon: CalendarDays },
  { to: '/map', label: '지도', icon: Map },
];

export function Layout() {
  const { state } = useNavigation();
  return (
    <div className="app-shell">
      <a href="#main" className="sr-only focus:not-sr-only">
        본문으로 이동
      </a>
      <header className="site-header">
        <Link to="/" className="brand-link">
          <span className="brand-symbol">
            <Heart size={16} fill="currentColor" aria-hidden="true" />
          </span>
          <span>Date Planner</span>
        </Link>
        <Link to="/settings" aria-label="설정" className="settings-link">
          <Settings size={20} />
        </Link>
      </header>
      <main id="main" className="app-main flex-1">
        {state === 'loading' ? <LoadingState /> : <Outlet />}
      </main>
      <nav aria-label="주 메뉴" className="bottom-nav">
        {navigation.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex min-h-16 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-xs ${isActive ? 'is-active' : ''}`
            }
          >
            <Icon size={21} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
