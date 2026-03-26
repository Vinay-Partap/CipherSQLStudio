import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AssignmentList from '../components/AssignmentList/AssignmentList';

function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#6366f1' }}>
          CipherSQLStudio
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.4rem 1rem',
              background: 'transparent',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#64748b'
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