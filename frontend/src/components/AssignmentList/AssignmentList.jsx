import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAssignments } from '../../services/api.js';
import './AssignmentList.scss';

function AssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const solved = JSON.parse(localStorage.getItem('solvedAssignments') || '[]');

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (err) {
      setError('Failed to load assignments: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = assignments.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || 
      (filter === 'Solved' ? solved.includes(a.id) : 
      filter === 'Unsolved' ? !solved.includes(a.id) : 
      a.difficulty === filter);
    return matchSearch && matchFilter;
  });

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="assignment-list">
      <header className="assignment-list__header">
        <h1>CipherSQLStudio</h1>
        <p>Practice SQL with interactive assignments</p>

        {/* Progress bar */}
        <div style={{ marginTop: '1rem', maxWidth: '400px', margin: '1rem auto 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.3rem' }}>
            <span>{solved.length} / {assignments.length} solved</span>
            <span>{assignments.length > 0 ? Math.round((solved.length / assignments.length) * 100) : 0}%</span>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '8px' }}>
            <div style={{
              background: '#6366f1',
              borderRadius: '999px',
              height: '8px',
              width: `${assignments.length > 0 ? (solved.length / assignments.length) * 100 : 0}%`,
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </header>

      {/* Search + Filter */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '0 2rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search assignments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '0.6rem 1rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        {['All', 'Easy', 'Medium', 'Hard', 'Solved', 'Unsolved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: filter === f ? '#6366f1' : '#e2e8f0',
              background: filter === f ? '#6366f1' : 'white',
              color: filter === f ? 'white' : '#64748b',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: filter === f ? '600' : '400',
              transition: 'all 0.15s'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ padding: '0 2rem', marginBottom: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
        {filtered.length} assignment{filtered.length !== 1 ? 's' : ''} found
      </div>

      <div className="assignment-list__grid">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>
            No assignments found
          </div>
        ) : (
          filtered.map((assignment) => (
            <Link
              key={assignment.id}
              to={`/assignment/${assignment.id}`}
              className="assignment-card"
              style={{ position: 'relative', textDecoration: 'none' }}
            >
              {solved.includes(assignment.id) && (
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: '#22c55e',
                  color: 'white',
                  borderRadius: '999px',
                  padding: '0.15rem 0.6rem',
                  fontSize: '0.7rem',
                  fontWeight: '600'
                }}>
                  ✓ Solved
                </div>
              )}
              <div className="assignment-card__header">
                <h3>{assignment.title}</h3>
                <span className={`difficulty difficulty--${assignment.difficulty?.toLowerCase()}`}>
                  {assignment.difficulty}
                </span>
              </div>
              <p className="assignment-card__question">{assignment.description}</p>
              <div className="assignment-card__meta">
                {assignment.sampleTables?.length || 0} table{assignment.sampleTables?.length !== 1 ? 's' : ''}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default AssignmentList;