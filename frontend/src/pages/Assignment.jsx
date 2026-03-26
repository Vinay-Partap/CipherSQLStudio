import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignments, executeQuery, getHint } from '../services/api';
import Editor from '@monaco-editor/react';
import './Assignment.scss';

function AssignmentPage() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [hints, setHints] = useState([]);
  const [hintLevel, setHintLevel] = useState(1);
  const [error, setError] = useState('');
  const [executing, setExecuting] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    loadAssignment();
  }, [id]);

  async function loadAssignment() {
    try {
      const data = await getAssignments();
      const found = data.find(a => String(a.id) === String(id));
      setAssignment(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExecute() {
    if (!query.trim()) return;
    setExecuting(true);
    setError('');
    setResult(null);
    try {
      const data = await executeQuery(id, query, sessionId);
      setResult(data);
      const solvedList = JSON.parse(localStorage.getItem('solvedAssignments') || '[]');
      if (!solvedList.includes(Number(id))) {
        solvedList.push(Number(id));
        localStorage.setItem('solvedAssignments', JSON.stringify(solvedList));
      }
    } catch (err) {
      setError(err.message || 'Query execution failed');
    } finally {
      setExecuting(false);
    }
  }

  async function handleHint() {
    if (hintLevel > 3) return;
    setHintLoading(true);
    try {
      const data = await getHint(id, query, error, hintLevel);
      setHints(prev => [...prev, { level: hintLevel, text: data.hint }]);
      setHintLevel(prev => prev + 1);
    } catch (err) {
      setHints(prev => [...prev, { level: hintLevel, text: 'Could not get hint. Try again.' }]);
    } finally {
      setHintLoading(false);
    }
  }

  if (loading) return <div>Loading assignment...</div>;
  if (!assignment) return <div>Assignment not found</div>;

  return (
    <div className="assignment-page">
      <div className="assignment-page__sidebar">
        <div className="question-panel">
          <div className="question-panel__header">
            <h1>{assignment.title}</h1>
          </div>
          <p className="question-panel__text">
            {assignment.question || assignment.description}
          </p>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3 style={{ color: 'var(--color-text)', marginBottom: '0.5rem' }}>Sample Table:</h3>
          {assignment.sampleTables?.map((table, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: 'var(--color-text)', marginBottom: '0.3rem' }}>{table.tableName}</h4>
              <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.8rem', color: 'var(--color-text)' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface)' }}>
                    {table.columns.map(col => (
                      <th key={col.columnName} style={{ padding: '0.4rem', textAlign: 'left' }}>{col.columnName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} style={{ padding: '0.4rem' }}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {hints.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-text)' }}>Hints:</h4>
            {hints.map((h, i) => (
              <div key={i} style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: h.level === 1 ? '#86efac' : h.level === 2 ? '#fcd34d' : '#fca5a5',
                background: h.level === 1 ? '#f0fdf4' : h.level === 2 ? '#fffbeb' : '#fef2f2',
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  marginBottom: '0.3rem',
                  color: h.level === 1 ? '#166534' : h.level === 2 ? '#92400e' : '#991b1b'
                }}>
                  {h.level === 1 ? '💡 HINT 1 — Gentle nudge' : h.level === 2 ? '🔍 HINT 2 — Concept' : '🎯 HINT 3 — Detailed'}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#374151' }}>{h.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="assignment-page__main">
        <Editor
          height="100%"
          language="sql"
          value={query}
          onChange={(val) => setQuery(val || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 16 }
          }}
        />
      </div>

      <div className="assignment-page__results">
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          gap: '0.5rem',
          background: 'var(--color-surface)'
        }}>
          <button
            onClick={handleExecute}
            disabled={executing}
            style={{
              padding: '0.5rem 1rem',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: executing ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              opacity: executing ? 0.7 : 1
            }}
          >
            {executing ? 'Running...' : '▶ Run Query'}
          </button>
          <button
            onClick={handleHint}
            disabled={hintLoading || hintLevel > 3}
            style={{
              padding: '0.5rem 1rem',
              background: hintLevel > 3 ? '#e2e8f0' : '#f59e0b',
              color: hintLevel > 3 ? '#94a3b8' : 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: hintLevel > 3 ? 'not-allowed' : 'pointer',
              fontWeight: '600'
            }}
          >
            {hintLoading ? 'Loading...' : hintLevel > 3 ? 'No more hints' : `💡 Hint ${hintLevel}/3`}
          </button>
        </div>

        <div style={{ padding: '1rem', overflowY: 'auto', background: 'var(--color-bg)' }}>
          {error && (
            <div style={{
              padding: '1rem',
              background: '#fef2f2',
              border: '1px solid #ef4444',
              borderRadius: '6px',
              color: '#dc2626',
              marginBottom: '1rem'
            }}>
              ❌ {error}
            </div>
          )}

          {result && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                <h4 style={{ color: 'var(--color-text)' }}>Result</h4>
                <span style={{
                  background: '#dcfce7',
                  color: '#166534',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px'
                }}>
                  {result.rows?.length || 0} rows
                </span>
              </div>
              <table border="1" cellPadding="5" style={{
                borderCollapse: 'collapse',
                width: '100%',
                fontSize: '0.85rem',
                color: 'var(--color-text)'
              }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface)' }}>
                    {result.columns?.map((col, i) => (
                      <th key={i} style={{ padding: '0.5rem', textAlign: 'left' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows?.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} style={{ padding: '0.5rem' }}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!error && !result && (
            <p style={{ color: '#94a3b8' }}>Query results will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AssignmentPage;