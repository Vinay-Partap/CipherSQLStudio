import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import AssignmentList from '../components/AssignmentList/AssignmentList';

function Home() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
          CipherSQLStudio
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            {user?.email}
          </span>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.4rem 0.75rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '0.4rem 1rem',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)'
            }}
          >
            Logout
          </button>
        </div>
      </nav>
      <AssignmentList />
    </div>
  );
}

export default Home;